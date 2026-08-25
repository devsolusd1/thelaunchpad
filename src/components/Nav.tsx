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
}: {
  title: string;
  homeHref?: string;
  logoUrl?: string | null;
  rightExtra?: React.ReactNode;
}) {
  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href={homeHref} className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <span className="text-2xl">🚀</span>
          )}
          <span className="text-lg font-bold text-white">{title}</span>
        </Link>
        <div className="flex items-center gap-3">
          {rightExtra}
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
}
