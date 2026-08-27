// Upload de metadata de token pra Pinata (IPFS). Usado quando PINATA_JWT
// esta configurada; caso contrario o site serve a metadata ele mesmo.
const PINATA_API = 'https://api.pinata.cloud';

export function pinataEnabled() {
  return !!(process.env.PINATA_JWT || '').trim();
}

function gatewayUrl(cid: string) {
  const gw = (process.env.PINATA_GATEWAY || 'gateway.pinata.cloud').replace(
    /^https?:\/\//,
    ''
  );
  return `https://${gw}/ipfs/${cid}`;
}

async function pinataFetch(path: string, init: RequestInit) {
  const res = await fetch(`${PINATA_API}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${process.env.PINATA_JWT!.trim()}`,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      `pinata ${res.status}: ${JSON.stringify(body).slice(0, 200)}`
    );
  return body as { IpfsHash: string };
}

export async function pinImage(
  data: Buffer,
  mime: string,
  name: string
): Promise<string> {
  const form = new FormData();
  form.append(
    'file',
    new Blob([new Uint8Array(data)], { type: mime }),
    `${name}.${mime.split('/')[1] || 'png'}`
  );
  form.append('pinataMetadata', JSON.stringify({ name: `${name}-image` }));
  const r = await pinataFetch('/pinning/pinFileToIPFS', {
    method: 'POST',
    body: form,
  });
  return gatewayUrl(r.IpfsHash);
}

export async function pinJson(
  json: Record<string, unknown>,
  name: string
): Promise<string> {
  const r = await pinataFetch('/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pinataContent: json,
      pinataMetadata: { name: `${name}-metadata` },
    }),
  });
  return gatewayUrl(r.IpfsHash);
}
