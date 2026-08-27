import type { Metadata } from 'next';
import { Bricolage_Grotesque, Nunito } from 'next/font/google';
import './globals.css';
import '@/styles/theme.css';
import '@/styles/pg-home.css';
import '@/styles/pg-create.css';
import '@/styles/pg-pad.css';
import '@/styles/pg-admin.css';
import '@/styles/pg-terms.css';
import '@/styles/overrides.css';
import WalletProviders from '@/components/WalletProviders';
import Background from '@/components/Background';
import { SITE_NAME } from '@/lib/env';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
});
const body = Nunito({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-body',
});

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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Background />
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  );
}
