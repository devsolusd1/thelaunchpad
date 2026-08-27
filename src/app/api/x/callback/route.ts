// Callback do OAuth do X: valida o state assinado, troca o code pelo token,
// le o handle e marca a launchpad como verificada.
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { decodeState, exchangeCode, fetchXUser, xEnabled } from '@/lib/xauth';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const stateParam = req.nextUrl.searchParams.get('state');
  const back = (slug: string, qs = '') =>
    NextResponse.redirect(new URL(`/s/${slug}${qs}`, req.nextUrl.origin));

  const state = stateParam ? decodeState(stateParam) : null;
  if (!state) return back('', '?xerror=invalid-state');

  try {
    if (!xEnabled()) throw new Error('not configured');
    if (!code) throw new Error('missing code');

    const token = await exchangeCode(code, state.verifier);
    const user = await fetchXUser(token);

    await prisma.launchpad.update({
      where: { slug: state.slug },
      data: { xHandle: user.username, xVerified: true },
    });
    return back(state.slug, '?xverified=1');
  } catch (e: any) {
    console.error('x callback failed:', e?.message);
    return back(state.slug, '?xerror=1');
  }
}
