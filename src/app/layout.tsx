import type { Metadata } from 'next';
import './globals.css';
import WalletProviders from '@/components/WalletProviders';
import { SITE_NAME } from '@/lib/env';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'A launchpad de launchpads na Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  );
}
