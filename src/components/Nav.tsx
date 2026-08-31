'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import ThemeToggle from './ThemeToggle';
import { PadLockup } from './brand';

const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (m) => m.WalletMultiButton
    ),
  { ssr: false }
);

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
        <Link href={homeHref} className="t-logo" aria-label={title}>
          {logoUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt=""
                style={{ width: 31, height: 31, borderRadius: 10, objectFit: 'cover' }}
              />
              {title}
            </>
          ) : (
            <PadLockup height={27} title={title} />
          )}
        </Link>
        {siteLinks && (
          <div className="t-links">
            <Link href="/#launchpads">Explore</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/pad">$PAD</Link>
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
