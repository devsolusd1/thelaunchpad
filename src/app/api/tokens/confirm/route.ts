import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyTokenPool } from '@/lib/verify';

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { id, slug, mint, pool, txSig, creatorWallet } = (await req.json()) || {};
    if (!mint || !pool) return err('missing fields');

    let token = id
      ? await prisma.token.findUnique({
          where: { id: String(id) },
          include: { launchpad: true },
        })
      : null;

    // reconciliacao: o pool existe on-chain mas o registro ficou pendente
    // (ex.: confirmacao falhou no browser) — recupera o pending mais recente
    if (!token && slug) {
      const pad = await prisma.launchpad.findUnique({
        where: { slug: String(slug).toLowerCase() },
      });
      if (pad)
        token = await prisma.token.findFirst({
          where: { launchpadId: pad.id, status: 'pending' },
          orderBy: { createdAt: 'desc' },
          include: { launchpad: true },
        });
    }
    if (!token) return err('token not found', 404);
    if (token.status === 'live') return NextResponse.json({ ok: true });

    const onchain = await verifyTokenPool(
      String(pool),
      String(mint),
      token.launchpad.configKey
    );

    await prisma.token.update({
      where: { id: token.id },
      data: {
        status: 'live',
        mint: String(mint),
        pool: String(pool),
        creatorWallet: creatorWallet
          ? String(creatorWallet)
          : onchain.creator || null,
        createTx: txSig ? String(txSig) : null,
      },
    });

    // marca como token principal da launchpad — apenas se quem criou o pool
    // on-chain for a wallet dona da launchpad
    if (token.isMain && onchain.creator === token.launchpad.ownerWallet) {
      await prisma.launchpad.update({
        where: { id: token.launchpadId },
        data: { mainTokenMint: String(mint) },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return err(e?.message || 'internal error', 500);
  }
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
