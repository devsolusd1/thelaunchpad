// Estatisticas agregadas (banco + on-chain com cache) usadas pelas paginas.
import { PublicKey } from '@solana/web3.js';
import {
  DynamicBondingCurveClient,
  getPriceFromSqrtPrice,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { prisma } from './db';
import { serverConnection } from './verify';
import { SOL_MINT, TOKEN_SUPPLY, TOKEN_DECIMALS } from './env';

/* ── total pago aos donos, por launchpad ─────────────────────────────── */
export async function payoutTotalsByPad(): Promise<Map<string, bigint>> {
  const rows = await prisma.feePayout.findMany({
    select: { launchpadId: true, amountRaw: true },
  });
  const map = new Map<string, bigint>();
  for (const r of rows)
    map.set(r.launchpadId, (map.get(r.launchpadId) || 0n) + BigInt(r.amountRaw));
  return map;
}

/* ── preco do SOL (cache 60s) ────────────────────────────────────────── */
let solPrice: { v: number; at: number } | null = null;
export async function solUsd(): Promise<number> {
  if (solPrice && Date.now() - solPrice.at < 60_000) return solPrice.v;
  try {
    const r = await fetch(`https://lite-api.jup.ag/price/v3?ids=${SOL_MINT}`, {
      cache: 'no-store',
    });
    const j = await r.json();
    const v = Number(j[SOL_MINT]?.usdPrice) || 0;
    if (v) solPrice = { v, at: Date.now() };
    return solPrice?.v || 0;
  } catch {
    return solPrice?.v || 0;
  }
}

/* ── estado da curva por pool (cache 60s) ────────────────────────────── */
export interface CurveStat {
  mcUsd: number | null;
  progress: number | null; // 0..1
  migrated: boolean;
}
const curveCache = new Map<string, { at: number; data: CurveStat }>();

export async function curveStats(
  pools: string[],
  quoteSymbol: string
): Promise<Map<string, CurveStat>> {
  const out = new Map<string, CurveStat>();
  const missing: string[] = [];
  for (const p of pools) {
    const hit = curveCache.get(p);
    if (hit && Date.now() - hit.at < 60_000) out.set(p, hit.data);
    else missing.push(p);
  }
  if (missing.length === 0) return out;

  try {
    const connection = serverConnection();
    const client = new DynamicBondingCurveClient(connection, 'confirmed');
    const quoteDec = quoteSymbol === 'USDC' ? 6 : 9;
    const quotePriceUsd = quoteSymbol === 'USDC' ? 1 : await solUsd();

    // limita pra nao explodir a RPC num pad gigante
    for (const pool of missing.slice(0, 30)) {
      try {
        const raw: any = await client.state.getPool(new PublicKey(pool));
        const vp = raw?.poolState ?? raw;
        if (!vp) continue;
        const cfg: any = await client.state.getPoolConfig(vp.config);
        const price = Number(
          getPriceFromSqrtPrice(vp.sqrtPrice, TOKEN_DECIMALS, quoteDec).toString()
        );
        const mcUsd = quotePriceUsd ? price * quotePriceUsd * TOKEN_SUPPLY : null;
        let progress: number | null = null;
        const reserve = BigInt(vp.quoteReserve?.toString?.() || '0');
        const threshold = BigInt(cfg?.migrationQuoteThreshold?.toString?.() || '0');
        if (threshold > 0n)
          progress = Math.min(1, Number((reserve * 1000n) / threshold) / 1000);
        const migrated = Number(vp.isMigrated) !== 0;
        const data: CurveStat = { mcUsd, progress: migrated ? 1 : progress, migrated };
        curveCache.set(pool, { at: Date.now(), data });
        out.set(pool, data);
      } catch {
        /* pool individual falhou; segue */
      }
    }
  } catch {
    /* rpc fora — paginas mostram sem stats */
  }
  return out;
}

/* ── fees nao clamadas de um pad (cache 30s) ─────────────────────────── */
const feeCache = new Map<string, { at: number; unclaimed: bigint; lifetime: bigint }>();
export async function padFees(
  slug: string,
  pools: string[]
): Promise<{ unclaimed: bigint; lifetime: bigint }> {
  const hit = feeCache.get(slug);
  if (hit && Date.now() - hit.at < 30_000)
    return { unclaimed: hit.unclaimed, lifetime: hit.lifetime };
  let unclaimed = 0n;
  let lifetime = 0n;
  try {
    const connection = serverConnection();
    const client = new DynamicBondingCurveClient(connection, 'confirmed');
    for (const pool of pools.slice(0, 50)) {
      try {
        const m = await client.state.getPoolFeeMetrics(new PublicKey(pool));
        unclaimed += BigInt(m.current.partnerQuoteFee.toString());
        lifetime += BigInt(m.total.totalTradingQuoteFee.toString());
      } catch {
        /* segue */
      }
    }
    feeCache.set(slug, { at: Date.now(), unclaimed, lifetime });
  } catch {
    /* rpc fora */
  }
  return { unclaimed, lifetime };
}

export function fmtUsdShort(n: number | null): string {
  if (n === null || !isFinite(n)) return '—';
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}
