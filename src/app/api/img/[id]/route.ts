import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const img = await prisma.image.findUnique({ where: { id: params.id } });
  if (!img) return new NextResponse('not found', { status: 404 });
  return new NextResponse(Buffer.from(img.data), {
    headers: {
      'Content-Type': img.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
