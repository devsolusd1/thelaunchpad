import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { RESERVED_SLUGS, SLUG_RE } from '@/lib/env';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const slug = (req.nextUrl.searchParams.get('slug') || '').toLowerCase();
  if (!SLUG_RE.test(slug) || RESERVED_SLUGS.includes(slug))
    return NextResponse.json({ available: false, reason: 'invalid' });
  const exists = await prisma.launchpad.findUnique({ where: { slug } });
  return NextResponse.json({ available: !exists });
}
