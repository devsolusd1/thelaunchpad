'use client';

// Ferramentas do dono da launchpad — aparecem so quando a wallet conectada
// e' a dona. Troca de logo com prova de propriedade (assinatura de mensagem).
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import bs58 from 'bs58';

export default function OwnerPanel({
  slug,
  ownerWallet,
  subdomainUrl,
}: {
  slug: string;
  ownerWallet: string;
  subdomainUrl: string;
}) {
  const wallet = useWallet();
  const router = useRouter();
  const [logo, setLogo] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const isOwner =
    wallet.connected && wallet.publicKey?.toBase58() === ownerWallet;
  if (!isOwner) return null;

  async function saveLogo() {
    setMsg('');
    if (!logo || !wallet.publicKey) return;
    if (!wallet.signMessage) {
      setMsg('your wallet does not support message signing');
      return;
    }
    try {
      setBusy(true);
      const timestamp = Date.now();
      const message = `thelaunchpad:update-logo:${slug}:${timestamp}`;
      const sig = await wallet.signMessage(new TextEncoder().encode(message));
      const logoBase64 = await fileToBase64(logo);
      const res = await fetch(`/api/launchpads/${slug}/logo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: wallet.publicKey.toBase58(),
          timestamp,
          signature: bs58.encode(sig),
          logoBase64,
          logoMime: logo.type,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'failed to update logo');
      setMsg('logo updated ✓');
      setLogo(null);
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card mt-8 space-y-4 border-accent/40 p-5">
      <h3 className="font-bold text-white">Owner tools</h3>

      <div className="text-sm text-gray-400">
        <p>
          Your pad answers at{' '}
          <a className="text-accent underline" href={subdomainUrl}>
            {subdomainUrl.replace(/^https?:\/\//, '')}
          </a>
          . New subdomains can take a while to propagate — this direct link
          always works in the meantime:{' '}
          <a className="text-accent underline" href={`/s/${slug}`}>
            /s/{slug}
          </a>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label className="label">Change logo (max 1.5MB)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            className="text-sm text-gray-400"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
          />
        </div>
        <button
          className="btn-primary"
          disabled={!logo || busy}
          onClick={saveLogo}
        >
          {busy ? 'Signing...' : 'Save logo'}
        </button>
      </div>
      {msg && (
        <p className={`text-sm ${msg.includes('✓') ? 'text-accent2' : 'text-red-300'}`}>
          {msg}
        </p>
      )}
      <p className="text-xs text-gray-500">
        Changing the logo asks your wallet for a signature (free, no
        transaction) to prove you own this launchpad.
      </p>
    </div>
  );
}

function fileToBase64(f: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(f);
  });
}
