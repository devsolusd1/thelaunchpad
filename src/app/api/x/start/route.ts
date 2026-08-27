// Inicio do "Verify with X": o dono da launchpad prova a propriedade com
// assinatura de mensagem e recebe a URL de autorizacao do X.
import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { xEnabled, makePkce, encodeState, authorizeUrl } from '@/lib/xauth';

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    if (!xEnabled())
      return err('X verification is not configured on the server', 503);

    const { slug, wallet, timestamp, signature } = (await req.json()) || {};
    const s = String(slug || '').toLowerCase();

    const pad = await prisma.launchpad.findUnique({ where: { slug: s } });
    if (!pad) return err('launchpad not found', 404);
    if (String(wallet) !== pad.ownerWallet)
      return err('only the launchpad owner can verify', 403);

    const ts = Number(timestamp);
    if (!ts || Math.abs(Date.now() - ts) > 10 * 60 * 1000)
      return err('signature expired, try again');

    let ok = false;
    try {
      ok = nacl.sign.detached.verify(
        new TextEncoder().encode(`thelaunchpad:verify-x:${s}:${ts}`),
        bs58.decode(String(signature)),
        new PublicKey(String(wallet)).toBytes()
      );
    } catch {
      ok = false;
    }
    if (!ok) return err('invalid signature', 403);

    const { verifier, challenge } = makePkce();
    const state = encodeState({
      slug: s,
      ts: Date.now(),
      nonce: crypto.randomBytes(8).toString('hex'),
      verifier,
    });
    return NextResponse.json({ url: authorizeUrl(state, challenge) });
  } catch (e: any) {
    return err(e?.message || 'internal error', 500);
  }
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
