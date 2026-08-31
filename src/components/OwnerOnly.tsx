'use client';

// Renderiza os filhos so quando a wallet conectada e' a dona do pad.
// (Gate de UI: os dados de fees sao publicos on-chain de qualquer jeito.)
import { useWallet } from '@solana/wallet-adapter-react';

export default function OwnerOnly({
  ownerWallet,
  children,
}: {
  ownerWallet: string;
  children: React.ReactNode;
}) {
  const wallet = useWallet();
  const isOwner =
    wallet.connected && wallet.publicKey?.toBase58() === ownerWallet;
  if (!isOwner) return null;
  return <>{children}</>;
}
