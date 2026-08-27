// Helpers do fluxo "Verify with X" (OAuth 2.0 + PKCE, confidential client).
// O state carrega slug + code_verifier assinados com HMAC — sem cookies,
// funciona igual no dominio raiz e nos subdominios.
import crypto from 'crypto';
import { ROOT_DOMAIN } from './env';

const b64url = (b: Buffer) =>
  b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function hmacSecret() {
  return process.env.X_CLIENT_SECRET || 'dev-secret';
}

export function xEnabled() {
  return !!(process.env.X_CLIENT_ID && process.env.X_CLIENT_SECRET);
}

export function xRedirectUri() {
  const proto = ROOT_DOMAIN.includes('localhost') ? 'http' : 'https';
  return `${proto}://${ROOT_DOMAIN}/api/x/callback`;
}

export interface XState {
  slug: string;
  ts: number;
  nonce: string;
  verifier: string;
}

export function encodeState(payload: XState): string {
  const data = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = b64url(
    crypto.createHmac('sha256', hmacSecret()).update(data).digest()
  );
  return `${data}.${sig}`;
}

export function decodeState(state: string): XState | null {
  const [data, sig] = String(state).split('.');
  if (!data || !sig) return null;
  const expected = b64url(
    crypto.createHmac('sha256', hmacSecret()).update(data).digest()
  );
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  )
    return null;
  try {
    const payload = JSON.parse(
      Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    ) as XState;
    if (!payload.slug || !payload.ts || !payload.verifier) return null;
    if (Math.abs(Date.now() - payload.ts) > 10 * 60 * 1000) return null; // 10 min
    return payload;
  } catch {
    return null;
  }
}

export function makePkce() {
  const verifier = b64url(crypto.randomBytes(32));
  const challenge = b64url(
    crypto.createHash('sha256').update(verifier).digest()
  );
  return { verifier, challenge };
}

export function authorizeUrl(state: string, challenge: string) {
  const qs = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.X_CLIENT_ID!,
    redirect_uri: xRedirectUri(),
    // users/me exige tweet.read + users.read
    scope: 'tweet.read users.read',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
  return `https://x.com/i/oauth2/authorize?${qs}`;
}

export async function exchangeCode(code: string, verifier: string) {
  const basic = Buffer.from(
    `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
  ).toString('base64');
  const res = await fetch('https://api.x.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: xRedirectUri(),
      code_verifier: verifier,
    }),
  });
  const j = await res.json();
  if (!res.ok || !j.access_token)
    throw new Error(`token exchange failed: ${JSON.stringify(j).slice(0, 200)}`);
  return j.access_token as string;
}

export async function fetchXUser(accessToken: string) {
  const res = await fetch('https://api.x.com/2/users/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const j = await res.json();
  if (!res.ok || !j.data?.username)
    throw new Error(`users/me failed: ${JSON.stringify(j).slice(0, 200)}`);
  return { id: j.data.id as string, username: j.data.username as string };
}
