import type { Metadata } from 'next';
import './globals.css';
import WalletProviders from '@/components/WalletProviders';
import { SITE_NAME } from '@/lib/env';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'The launchpad of launchpads on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  );
}
