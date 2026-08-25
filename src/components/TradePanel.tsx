'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import BN from 'bn.js';
import {
  DynamicBondingCurveClient,
  swapQuote,
  getPriceFromSqrtPrice,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { SOL_MINT, TOKEN_SUPPLY, TOKEN_DECIMALS } from '@/lib/env';
import { fmtAmount, fmtUsd } from '@/lib/format';

interface Props {
  pool: string;
  mint: string;
  symbol: string;
  quoteSymbol: string;
  quoteMint: string;
  quoteDecimals: number;
  feeBps: number;
}

export default function TradePanel(props: Props) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const client = useMemo(
    () => new DynamicBondingCurveClient(connection, 'confirmed'),
    [connection]
  );

  const [virtualPool, setVirtualPool] = useState<any>(null);
  const [poolConfig, setPoolConfig] = useState<any>(null);
  const [quoteUsd, setQuoteUsd] = useState(1);
  const [migrated, setMigrated] = useState(false);

  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [slippagePct, setSlippagePct] = useState(1);
  const [quoteBalance, setQuoteBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lastSig, setLastSig] = useState('');

  const refresh = useCallback(async () => {
    try {
      const vp = await client.state.getPool(new PublicKey(props.pool));
      if (!vp) return;
      setVirtualPool(vp);
      setMigrated(Number((vp as any).isMigrated) !== 0);
      if (!poolConfig) {
        const cfg = await client.state.getPoolConfig((vp as any).config);
        setPoolConfig(cfg);
      }
      if (props.quoteMint === SOL_MINT) {
        const r = await fetch('/api/price');
        const j = await r.json();
        if (j.solUsd) setQuoteUsd(j.solUsd);
      }
    } catch {
      /* rpc hiccup */
    }
  }, [client, props.pool, props.quoteMint, poolConfig]);

  const refreshBalances = useCallback(async () => {
    if (!wallet.publicKey) return;
    try {
      if (props.quoteMint === SOL_MINT) {
        const b = await connection.getBalance(wallet.publicKey);
        setQuoteBalance(b / LAMPORTS_PER_SOL);
      } else {
        const ata = getAssociatedTokenAddressSync(
          new PublicKey(props.quoteMint),
          wallet.publicKey
        );
        const b = await connection
          .getTokenAccountBalance(ata)
          .then((r) => Number(r.value.uiAmount) || 0)
          .catch(() => 0);
        setQuoteBalance(b);
      }
      const tokenAta = getAssociatedTokenAddressSync(
        new PublicKey(props.mint),
        wallet.publicKey
      );
      const tb = await connection
        .getTokenAccountBalance(tokenAta)
        .then((r) => Number(r.value.uiAmount) || 0)
        .catch(() => 0);
      setTokenBalance(tb);
    } catch {
      /* ignore */
    }
  }, [connection, wallet.publicKey, props.quoteMint, props.mint]);

  useEffect(() => {
    refresh();
    const i = setInterval(refresh, 15_000);
    return () => clearInterval(i);
  }, [refresh]);

  useEffect(() => {
    refreshBalances();
    const i = setInterval(refreshBalances, 20_000);
    return () => clearInterval(i);
  }, [refreshBalances]);

  // preco / mc / progresso
  const stats = useMemo(() => {
    if (!virtualPool) return null;
    try {
      const price = Number(
        getPriceFromSqrtPrice(
          (virtualPool as any).sqrtPrice,
          TOKEN_DECIMALS,
          props.quoteDecimals
        ).toString()
      );
      const mcUsd = price * quoteUsd * TOKEN_SUPPLY;
      let progress = 0;
      if (poolConfig) {
        const reserve = BigInt(
          (virtualPool as any).quoteReserve?.toString?.() || '0'
        );
        const threshold = BigInt(
          (poolConfig as any).migrationQuoteThreshold?.toString?.() || '0'
        );
        if (threshold > 0n)
          progress = Math.min(1, Number((reserve * 1000n) / threshold) / 1000);
      }
      return { price, mcUsd, progress };
    } catch {
      return null;
    }
  }, [virtualPool, poolConfig, quoteUsd, props.quoteDecimals]);

  // estimativa de saida
  const estimate = useMemo(() => {
    if (!virtualPool || !poolConfig) return null;
    const amt = Number(amount);
    if (!amt || amt <= 0) return null;
    try {
      const swapBaseForQuote = side === 'sell';
      const decimalsIn = swapBaseForQuote ? TOKEN_DECIMALS : props.quoteDecimals;
      const amountIn = new BN(Math.round(amt * 10 ** decimalsIn).toString());
      const q: any = swapQuote(
        virtualPool,
        poolConfig,
        swapBaseForQuote,
        amountIn,
        Math.round(slippagePct * 100),
        false,
        new BN(Math.floor(Date.now() / 1000)),
        false
      );
      const outDecimals = swapBaseForQuote ? props.quoteDecimals : TOKEN_DECIMALS;
      const out = Number(q.amountOut?.toString?.() || '0') / 10 ** outDecimals;
      const minOut = q.minimumAmountOut ?? q.amountOut;
      return { out, amountIn, minOut: new BN(minOut.toString()) };
    } catch {
      return null;
    }
  }, [virtualPool, poolConfig, amount, side, slippagePct, props.quoteDecimals]);

  async function doSwap() {
    setError('');
    setLastSig('');
    if (!wallet.publicKey || !wallet.connected) {
      setVisible(true);
      return;
    }
    if (!estimate) return;
    try {
      setBusy(true);
      const tx = await client.pool.swap({
        owner: wallet.publicKey,
        pool: new PublicKey(props.pool),
        amountIn: estimate.amountIn,
        minimumAmountOut: estimate.minOut,
        swapBaseForQuote: side === 'sell',
        referralTokenAccount: null,
      });
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash('confirmed');
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = blockhash;
      const sig = await wallet.sendTransaction(tx, connection);
      const conf = await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        'confirmed'
      );
      if (conf.value.err)
        throw new Error(`swap falhou: ${JSON.stringify(conf.value.err)}`);
      setLastSig(sig);
      setAmount('');
      await Promise.all([refresh(), refreshBalances()]);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  if (migrated) {
    return (
      <div className="card space-y-4 p-5">
        <h3 className="text-lg font-bold text-white">🎓 Token graduado!</h3>
        <p className="text-sm text-gray-400">
          A curva completou e a liquidez migrou pra um pool DAMM v2 da Meteora.
          Negocie pela Jupiter:
        </p>
        <a
          className="btn-primary w-full"
          href={`https://jup.ag/tokens/${props.mint}`}
          target="_blank"
        >
          Trocar na Jupiter
        </a>
      </div>
    );
  }

  return (
    <div className="card h-fit space-y-4 p-5">
      {stats && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] uppercase text-gray-500">Preco</div>
            <div className="text-sm font-bold text-white">
              {stats.price < 0.000001
                ? stats.price.toExponential(2)
                : stats.price.toFixed(9)}{' '}
              <span className="text-[10px] text-gray-500">{props.quoteSymbol}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-gray-500">MC</div>
            <div className="text-sm font-bold text-white">{fmtUsd(stats.mcUsd)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-gray-500">Curva</div>
            <div className="text-sm font-bold text-accent2">
              {(stats.progress * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}
      {stats && (
        <div className="h-2 overflow-hidden rounded-full bg-panel2">
          <div
            className="h-full bg-accent2 transition-all"
            style={{ width: `${stats.progress * 100}%` }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          className={side === 'buy' ? 'btn bg-accent2 text-black' : 'btn-outline'}
          onClick={() => { setSide('buy'); setAmount(''); }}
        >
          Comprar
        </button>
        <button
          className={side === 'sell' ? 'btn bg-red-500 text-white' : 'btn-outline'}
          onClick={() => { setSide('sell'); setAmount(''); }}
        >
          Vender
        </button>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>
            Quantidade ({side === 'buy' ? props.quoteSymbol : `$${props.symbol}`})
          </span>
          <span>
            saldo:{' '}
            {side === 'buy'
              ? `${fmtAmount(quoteBalance)} ${props.quoteSymbol}`
              : fmtAmount(tokenBalance)}
          </span>
        </div>
        <input
          className="input"
          type="number"
          min={0}
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="mt-2 flex gap-1">
          {side === 'buy'
            ? [0.1, 0.5, 1, 2].map((v) => (
                <button
                  key={v}
                  className="flex-1 rounded border border-line bg-panel2 py-1 text-xs hover:border-accent"
                  onClick={() => setAmount(String(v))}
                >
                  {v} {props.quoteSymbol}
                </button>
              ))
            : [25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  className="flex-1 rounded border border-line bg-panel2 py-1 text-xs hover:border-accent"
                  onClick={() =>
                    setAmount(String((tokenBalance * p) / 100))
                  }
                >
                  {p}%
                </button>
              ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Slippage</span>
        <div className="flex gap-1">
          {[0.5, 1, 3, 5].map((s) => (
            <button
              key={s}
              className={`rounded px-2 py-0.5 ${
                slippagePct === s
                  ? 'bg-accent text-white'
                  : 'border border-line bg-panel2'
              }`}
              onClick={() => setSlippagePct(s)}
            >
              {s}%
            </button>
          ))}
        </div>
      </div>

      {estimate && (
        <div className="rounded-lg bg-panel2 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Recebe ~</span>
            <span className="font-bold text-white">
              {fmtAmount(estimate.out)}{' '}
              {side === 'buy' ? `$${props.symbol}` : props.quoteSymbol}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>Fee da launchpad</span>
            <span>{props.feeBps / 100}%</span>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
          {error}
        </div>
      )}
      {lastSig && (
        <a
          className="block truncate text-xs text-accent2 underline"
          href={`https://solscan.io/tx/${lastSig}`}
          target="_blank"
        >
          ✓ swap confirmado — ver no Solscan
        </a>
      )}

      <button
        className={side === 'buy' ? 'btn bg-accent2 text-black w-full py-3' : 'btn bg-red-500 text-white w-full py-3'}
        disabled={busy || (!estimate && wallet.connected)}
        onClick={doSwap}
      >
        {busy
          ? 'Enviando...'
          : wallet.connected
            ? side === 'buy'
              ? `Comprar $${props.symbol}`
              : `Vender $${props.symbol}`
            : 'Conectar wallet'}
      </button>
    </div>
  );
}
