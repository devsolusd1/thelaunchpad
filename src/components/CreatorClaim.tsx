'use client';

// Painel do CRIADOR do token (pads com split de criador): mostra as fees
// acumuladas on-chain em nome dele e permite clamar direto — sem bot,
// sem custodia, e' o proprio programa da Meteora pagando.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';
import {
  DynamicBondingCurveClient,
  U64_MAX,
} from '@meteora-ag/dynamic-bonding-curve-sdk';

export default function CreatorClaim({
  pool,
  creatorWallet,
  quoteSymbol,
  quoteDecimals,
  creatorFeePct,
}: {
  pool: string;
  creatorWallet: string | null;
  quoteSymbol: string;
  quoteDecimals: number;
  creatorFeePct: number;
}) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const client = useMemo(
    () => new DynamicBondingCurveClient(connection, 'confirmed'),
    [connection]
  );

  const [unclaimed, setUnclaimed] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const isCreator =
    wallet.connected &&
    !!creatorWallet &&
    wallet.publicKey?.toBase58() === creatorWallet;

  const refresh = useCallback(async () => {
    try {
      const m = await client.state.getPoolFeeMetrics(new PublicKey(pool));
      setUnclaimed(
        Number(m.current.creatorQuoteFee.toString()) / 10 ** quoteDecimals
      );
    } catch {
      /* rpc */
    }
  }, [client, pool, quoteDecimals]);

  useEffect(() => {
    if (!isCreator || creatorFeePct === 0) return;
    refresh();
    const i = setInterval(refresh, 30_000);
    return () => clearInterval(i);
  }, [isCreator, creatorFeePct, refresh]);

  if (creatorFeePct === 0 || !isCreator) return null;

  async function claim() {
    if (!wallet.publicKey) return;
    try {
      setBusy(true);
      setMsg('');
      const tx = await client.creator.claimCreatorTradingFee({
        creator: wallet.publicKey,
        payer: wallet.publicKey,
        pool: new PublicKey(pool),
        maxBaseAmount: new BN(0),
        maxQuoteAmount: U64_MAX,
      });
      const bh = await connection.getLatestBlockhash('confirmed');
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = bh.blockhash;
      const sig = await wallet.sendTransaction(tx, connection);
      const conf = await connection.confirmTransaction(
        { signature: sig, ...bh },
        'confirmed'
      );
      if (conf.value.err) throw new Error('claim failed on-chain');
      setMsg('claimed ✓');
      await refresh();
    } catch (e: any) {
      setMsg(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card mt-4 border-accent/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="label !mb-0">Your creator fees</div>
          <div className="text-xl font-black text-accent">
            {unclaimed === null ? '…' : unclaimed.toFixed(6)} {quoteSymbol}
          </div>
        </div>
        <button
          className="btn-primary"
          disabled={busy || !unclaimed}
          onClick={claim}
        >
          {busy ? 'Claiming…' : 'Claim'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        You launched this token — {creatorFeePct}% of every trade&apos;s net
        fee accrues to you on-chain. Claiming sends it straight to your
        wallet.
      </p>
      {msg && (
        <p className={`mt-1 text-xs ${msg.includes('✓') ? 'text-accent2' : 'text-red-300'}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
