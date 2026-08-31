import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { tokenPageUrl } from '@/lib/env';

export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await prisma.token.findUnique({
    where: { id: params.id },
    include: { launchpad: { select: { slug: true } } },
  });
  if (!token) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const origin = req.nextUrl.origin;
  return NextResponse.json(
    {
      name: token.name,
      symbol: token.symbol,
      description: token.description || '',
      image: token.imageId ? `${origin}/api/img/${token.imageId}` : '',
      // link fixo da pagina do token no site (quando o mint ja e' conhecido)
      website: token.mint
        ? tokenPageUrl(token.launchpad.slug, token.mint)
        : token.website || '',
      twitter: token.twitter || '',
      telegram: token.telegram || '',
    },
    { headers: { 'Cache-Control': 'public, max-age=300' } }
  );
}
