import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyTokenPool } from '@/lib/verify';

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { id, mint, pool, txSig, creatorWallet } = (await req.json()) || {};
    if (!id || !mint || !pool || !txSig) return err('campos faltando');

    const token = await prisma.token.findUnique({
      where: { id: String(id) },
      include: { launchpad: true },
    });
    if (!token) return err('token nao encontrado', 404);
    if (token.status === 'live') return NextResponse.json({ ok: true });

    await verifyTokenPool(String(pool), String(mint), token.launchpad.configKey);

    await prisma.token.update({
      where: { id: token.id },
      data: {
        status: 'live',
        mint: String(mint),
        pool: String(pool),
        creatorWallet: creatorWallet ? String(creatorWallet) : null,
        createTx: String(txSig),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return err(e?.message || 'erro interno', 500);
  }
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
