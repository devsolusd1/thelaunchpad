'use client';

import { ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { RPC_URL } from '@/lib/env';

import '@solana/wallet-adapter-react-ui/styles.css';

export default function WalletProviders({ children }: { children: ReactNode }) {
  // wallets registradas via Wallet Standard (Phantom, Solflare, Backpack...)
  // sao detectadas automaticamente; nao precisamos listar adapters legados
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={RPC_URL} config={{ commitment: 'confirmed' }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
