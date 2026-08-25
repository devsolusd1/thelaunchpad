import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { prisma } from '@/lib/db';
import { serverConnection } from '@/lib/verify';

export const revalidate = 0;

// cache leve em memoria (a consulta bate na RPC por pool)
const cache = new Map<string, { at: number; data: unknown }>();

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug.toLowerCase();
  const hit = cache.get(slug);
  if (hit && Date.now() - hit.at < 30_000) return NextResponse.json(hit.data);

  const pad = await prisma.launchpad.findUnique({
    where: { slug },
    include: {
      tokens: { where: { status: 'live' }, take: 50 },
      payouts: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  });
  if (!pad) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const connection = serverConnection();
  const client = new DynamicBondingCurveClient(connection, 'confirmed');

  let unclaimedRaw = 0n;
  let lifetimeRaw = 0n;
  for (const t of pad.tokens) {
    if (!t.pool) continue;
    try {
      const m = await client.state.getPoolFeeMetrics(new PublicKey(t.pool));
      unclaimedRaw += BigInt(m.current.partnerQuoteFee.toString());
      lifetimeRaw += BigInt(m.total.totalTradingQuoteFee.toString());
    } catch {
      // pool pode ter migrado ou RPC falhou; segue o jogo
    }
  }

  const paidRaw = pad.payouts.reduce((s, p) => s + BigInt(p.amountRaw), 0n);
  const data = {
    quoteSymbol: pad.quoteSymbol,
    ownerWallet: pad.ownerWallet,
    unclaimedRaw: unclaimedRaw.toString(),
    lifetimeRaw: lifetimeRaw.toString(),
    paidToOwnerRaw: paidRaw.toString(),
    payouts: pad.payouts.map((p) => ({
      amountRaw: p.amountRaw,
      txSig: p.txSig,
      createdAt: p.createdAt,
    })),
  };
  cache.set(slug, { at: Date.now(), data });
  return NextResponse.json(data);
}
