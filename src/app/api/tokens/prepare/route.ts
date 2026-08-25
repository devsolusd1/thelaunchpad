import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const revalidate = 0;

// Registra o token como "pending" e devolve a URI de metadata que o mint
// vai usar — precisa existir ANTES do createPool.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { launchpadSlug, name, symbol, description, imageBase64, imageMime, website, twitter, telegram } =
      body || {};

    if (!name || String(name).length > 32) return err('invalid name (max 32)');
    if (!symbol || !/^[A-Za-z0-9$]{1,10}$/.test(String(symbol)))
      return err('invalid ticker (1-10 alphanumeric)');

    const pad = await prisma.launchpad.findUnique({
      where: { slug: String(launchpadSlug || '').toLowerCase() },
    });
    if (!pad) return err('launchpad not found', 404);

    let imageId: string | undefined;
    if (imageBase64 && imageMime) {
      const buf = Buffer.from(String(imageBase64), 'base64');
      if (buf.length > 1_500_000) return err('image larger than 1.5MB');
      if (!/^image\/(png|jpe?g|gif|webp)$/.test(imageMime)) return err('invalid image format');
      const img = await prisma.image.create({ data: { mime: imageMime, data: buf } });
      imageId = img.id;
    }

    const token = await prisma.token.create({
      data: {
        launchpadId: pad.id,
        name: String(name),
        symbol: String(symbol).toUpperCase(),
        description: description ? String(description).slice(0, 500) : null,
        imageId,
        website: opt(website),
        twitter: opt(twitter),
        telegram: opt(telegram),
      },
    });

    const origin = req.nextUrl.origin;
    return NextResponse.json({
      id: token.id,
      uri: `${origin}/api/metadata/${token.id}`,
      configKey: pad.configKey,
      quoteMint: pad.quoteMint,
    });
  } catch (e: any) {
    return err(e?.message || 'internal error', 500);
  }
}

function opt(v: unknown): string | null {
  return v ? String(v).slice(0, 200) : null;
}
function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
