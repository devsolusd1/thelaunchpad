// Atualizacao de configuracoes da launchpad pelo dono (branding, links,
// cor, GA, featured token, logo). Prova de propriedade: assinatura ed25519.
import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { prisma } from '@/lib/db';

export const revalidate = 0;

const MAX_AGE_MS = 10 * 60 * 1000;

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = (await req.json()) || {};
    const { wallet, timestamp, signature } = body;
    const slug = params.slug.toLowerCase();

    const pad = await prisma.launchpad.findUnique({ where: { slug } });
    if (!pad) return err('launchpad not found', 404);
    if (String(wallet) !== pad.ownerWallet)
      return err('only the launchpad owner can update settings', 403);

    const ts = Number(timestamp);
    if (!ts || Math.abs(Date.now() - ts) > MAX_AGE_MS)
      return err('signature expired, try again');

    let ok = false;
    try {
      ok = nacl.sign.detached.verify(
        new TextEncoder().encode(`thelaunchpad:update:${slug}:${ts}`),
        bs58.decode(String(signature)),
        new PublicKey(String(wallet)).toBytes()
      );
    } catch {
      ok = false;
    }
    if (!ok) return err('invalid signature', 403);

    const data: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const v = String(body.name).trim();
      if (!v || v.length > 60) return err('invalid name');
      data.name = v;
    }
    if (body.description !== undefined)
      data.description = body.description
        ? String(body.description).slice(0, 500)
        : null;
    for (const k of ['twitter', 'telegram', 'website'] as const) {
      if (body[k] !== undefined)
        data[k] = body[k] ? String(body[k]).slice(0, 200) : null;
    }
    if (body.accentColor !== undefined) {
      const v = String(body.accentColor || '');
      if (v && !/^#[0-9a-fA-F]{6}$/.test(v)) return err('invalid color');
      data.accentColor = v || null;
    }
    if (body.gaId !== undefined) {
      const v = String(body.gaId || '').trim();
      if (v && !/^G-[A-Z0-9]{4,16}$/.test(v))
        return err('invalid Google Analytics ID (G-XXXXXXXXXX)');
      data.gaId = v || null;
    }
    if (body.mainTokenMint !== undefined) {
      const v = String(body.mainTokenMint || '');
      if (v) {
        const tok = await prisma.token.findFirst({
          where: { mint: v, launchpadId: pad.id, status: 'live' },
        });
        if (!tok) return err('token does not belong to this launchpad');
      }
      data.mainTokenMint = v || null;
    }
    if (body.logoBase64 && body.logoMime) {
      const buf = Buffer.from(String(body.logoBase64), 'base64');
      if (buf.length > 1_500_000) return err('logo larger than 1.5MB');
      if (!/^image\/(png|jpe?g|gif|webp)$/.test(String(body.logoMime)))
        return err('invalid logo format');
      const img = await prisma.image.create({
        data: { mime: String(body.logoMime), data: buf },
      });
      data.logoId = img.id;
    }

    if (Object.keys(data).length === 0) return err('nothing to update');

    await prisma.launchpad.update({ where: { slug }, data });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return err(e?.message || 'internal error', 500);
  }
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
