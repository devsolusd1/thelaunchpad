'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

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
    <nav className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href={homeHref} className="flex items-center gap-3">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
            )}
            <span className="text-lg font-bold text-white">{title}</span>
          </Link>
          {siteLinks && (
            <div className="hidden items-center gap-6 text-sm font-semibold text-gray-400 md:flex">
              <Link href="/flywheel" className="hover:text-accent">
                Flywheel
              </Link>
              <Link href="/docs" className="hover:text-accent">
                Docs
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {rightExtra}
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
}
