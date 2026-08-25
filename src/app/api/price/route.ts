import { NextRequest, NextResponse } from 'next/server';
import { SOL_MINT } from '@/lib/env';

export const revalidate = 0;

let cache: { price: number; at: number } | null = null;

export async function GET(_req: NextRequest) {
  if (cache && Date.now() - cache.at < 30_000)
    return NextResponse.json({ solUsd: cache.price });
  try {
    const r = await fetch(`https://lite-api.jup.ag/price/v3?ids=${SOL_MINT}`, {
      cache: 'no-store',
    });
    const j = await r.json();
    const price = Number(j[SOL_MINT]?.usdPrice);
    if (!price) throw new Error('sem preco');
    cache = { price, at: Date.now() };
    return NextResponse.json({ solUsd: price });
  } catch (e) {
    if (cache) return NextResponse.json({ solUsd: cache.price });
    return NextResponse.json({ error: 'failed to fetch SOL price' }, { status: 502 });
  }
}
