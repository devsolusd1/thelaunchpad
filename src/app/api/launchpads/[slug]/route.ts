import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const revalidate = 0;

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const pad = await prisma.launchpad.findUnique({
    where: { slug: params.slug.toLowerCase() },
    include: {
      tokens: {
        where: { status: 'live' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!pad) return NextResponse.json({ error: 'nao encontrada' }, { status: 404 });
  return NextResponse.json({ launchpad: pad });
}
