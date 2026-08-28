'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import ThemeToggle from './ThemeToggle';

const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (m) => m.WalletMultiButton
    ),
  { ssr: false }
);

export function FlameMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c3.6 2.6 5.6 6 5.6 9.4A5.6 5.6 0 0 1 12 18a5.6 5.6 0 0 1-5.6-5.6C6.4 9 8.4 5.6 12 3Z" />
      <path d="M12 18v3" />
    </svg>
  );
}

export default function Nav({
  title,
  homeHref = '/',
  logoUrl,
  rightExtra,
  siteLinks = false,
}: {
  title: string;
  homeHref?: string;
  logoUrl?: string | null;
  rightExtra?: React.ReactNode;
  siteLinks?: boolean;
}) {
  return (
    <nav className="t-nav">
      <div className="t-nav-in">
        <Link href={homeHref} className="t-logo">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              style={{ width: 31, height: 31, borderRadius: 10, objectFit: 'cover' }}
            />
          ) : (
            <span className="t-mark">
              <FlameMark />
            </span>
          )}
          {title}
        </Link>
        {siteLinks && (
          <div className="t-links">
            <Link href="/#launchpads">Explore</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/flywheel">Flywheel</Link>
            <Link href="/docs">Docs</Link>
          </div>
        )}
        <div className="t-right">
          {rightExtra}
          <ThemeToggle />
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
}
