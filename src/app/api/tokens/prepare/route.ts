import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { pinataEnabled, pinImage, pinJson } from '@/lib/pinata';

export const revalidate = 0;

// Registra o token como "pending" e devolve a URI de metadata que o mint
// vai usar — precisa existir ANTES do createPool. Com PINATA_JWT definida,
// imagem e JSON vao pro IPFS (URI independente do dominio do site);
// sem ela (ou se a Pinata falhar), o proprio site serve a metadata.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { launchpadSlug, name, symbol, description, imageBase64, imageMime, website, twitter, telegram, asMain } =
      body || {};

    if (!name || String(name).length > 32) return err('invalid name (max 32)');
    if (!symbol || !/^[A-Za-z0-9$]{1,10}$/.test(String(symbol)))
      return err('invalid ticker (1-10 alphanumeric)');

    const pad = await prisma.launchpad.findUnique({
      where: { slug: String(launchpadSlug || '').toLowerCase() },
    });
    if (!pad) return err('launchpad not found', 404);

    let imageId: string | undefined;
    let imageBuf: Buffer | undefined;
    if (imageBase64 && imageMime) {
      imageBuf = Buffer.from(String(imageBase64), 'base64');
      if (imageBuf.length > 1_500_000) return err('image larger than 1.5MB');
      if (!/^image\/(png|jpe?g|gif|webp)$/.test(imageMime)) return err('invalid image format');
      const img = await prisma.image.create({
        data: { mime: imageMime, data: imageBuf },
      });
      imageId = img.id;
    }

    const token = await prisma.token.create({
      data: {
        launchpadId: pad.id,
        name: String(name),
        symbol: String(symbol).toUpperCase(),
        description: description ? String(description).slice(0, 500) : null,
        imageId,
        // pedido de "token principal": so vale se, na confirmacao, o criador
        // on-chain do pool for o dono da launchpad
        isMain: !!asMain,
        website: opt(website),
        twitter: opt(twitter),
        telegram: opt(telegram),
      },
    });

    const origin = req.nextUrl.origin;
    let uri = `${origin}/api/metadata/${token.id}`;

    if (pinataEnabled()) {
      try {
        let imageUrl = imageId ? `${origin}/api/img/${imageId}` : '';
        if (imageBuf && imageMime)
          imageUrl = await pinImage(imageBuf, String(imageMime), token.symbol);
        uri = await pinJson(
          {
            name: token.name,
            symbol: token.symbol,
            description: token.description || '',
            image: imageUrl,
            website: token.website || '',
            twitter: token.twitter || '',
            telegram: token.telegram || '',
          },
          token.symbol
        );
        await prisma.token.update({
          where: { id: token.id },
          data: { uri },
        });
      } catch (e) {
        // IPFS fora do ar nao pode travar o launch — usa a URI do site
        console.error('pinata upload failed, falling back to self-hosted:', e);
      }
    }

    return NextResponse.json({
      id: token.id,
      uri,
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
