// Troca de logo pelo dono da launchpad. Prova de propriedade: assinatura
// ed25519 de uma mensagem com timestamp, feita pela wallet dona.
import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { prisma } from '@/lib/db';

export const revalidate = 0;

const MAX_AGE_MS = 10 * 60 * 1000;

function logoMessage(slug: string, timestamp: number) {
  return `thelaunchpad:update-logo:${slug}:${timestamp}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { wallet, timestamp, signature, logoBase64, logoMime } =
      (await req.json()) || {};
    const slug = params.slug.toLowerCase();

    const pad = await prisma.launchpad.findUnique({ where: { slug } });
    if (!pad) return err('launchpad not found', 404);
    if (String(wallet) !== pad.ownerWallet)
      return err('only the launchpad owner can update the logo', 403);

    const ts = Number(timestamp);
    if (!ts || Math.abs(Date.now() - ts) > MAX_AGE_MS)
      return err('signature expired, try again');

    let ok = false;
    try {
      ok = nacl.sign.detached.verify(
        new TextEncoder().encode(logoMessage(slug, ts)),
        bs58.decode(String(signature)),
        new PublicKey(String(wallet)).toBytes()
      );
    } catch {
      ok = false;
    }
    if (!ok) return err('invalid signature', 403);

    if (!logoBase64 || !logoMime) return err('missing image');
    const buf = Buffer.from(String(logoBase64), 'base64');
    if (buf.length > 1_500_000) return err('logo larger than 1.5MB');
    if (!/^image\/(png|jpe?g|gif|webp)$/.test(String(logoMime)))
      return err('invalid logo format');

    const img = await prisma.image.create({
      data: { mime: String(logoMime), data: buf },
    });
    await prisma.launchpad.update({
      where: { slug },
      data: { logoId: img.id },
    });
    return NextResponse.json({ ok: true, logoId: img.id });
  } catch (e: any) {
    return err(e?.message || 'internal error', 500);
  }
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
