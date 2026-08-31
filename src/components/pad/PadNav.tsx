'use client';

// Nav das paginas de um pad (estilo pad.html): crumb pro site, identidade
// do pad, Fees, botao Manage (so pro dono) e wallet.
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import ThemeToggle from '@/components/ThemeToggle';
import { PadWordmark } from '@/components/brand';

const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then((m) => m.WalletMultiButton),
  { ssr: false }
);

export default function PadNav({
  siteName,
  siteUrl,
  slug,
  padName,
  logoUrl,
  ownerWallet,
}: {
  siteName: string;
  siteUrl: string;
  slug: string;
  padName: string;
  logoUrl: string | null;
  ownerWallet: string;
}) {
  const wallet = useWallet();
  const isOwner =
    wallet.connected && wallet.publicKey?.toBase58() === ownerWallet;

  return (
    <nav className="nav">
      <div className="nav-in">
        <a className="crumb" href={siteUrl}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12H5" /><path d="m11 18-6-6 6-6" />
          </svg>
          <span style={{ display: 'flex' }}>
            <PadWordmark height={10} title={siteName} />
          </span>
        </a>
        <a href={`/s/${slug}`} className="nav-pad" style={{ textDecoration: 'none', color: 'inherit' }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" style={{ width: 27, height: 27, borderRadius: 9, objectFit: 'cover' }} />
          ) : (
            <span className="tile">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="7.6" /><circle cx="12" cy="12" r="3" />
              </svg>
            </span>
          )}
          {padName}
        </a>
        <div className="right">
          {isOwner && (
            <>
              <a className="btn ghost" href={`/s/${slug}/dashboard`}>
                Manage
              </a>
              <a className="btn ghost" href={`/s/${slug}/dashboard`}>
                Fees
              </a>
            </>
          )}
          <ThemeToggle />
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
}
