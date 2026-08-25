import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  QUOTES,
  QuoteSymbol,
  RESERVED_SLUGS,
  SLUG_RE,
  MIN_FEE_BPS,
  MAX_FEE_BPS,
  MIN_INITIAL_MC_USD,
  MAX_INITIAL_MC_USD,
  MIN_MIGRATION_RATIO,
} from '@/lib/env';
import { verifyLaunchpadConfig, verifyCreationPayment } from '@/lib/verify';

export const revalidate = 0;

export async function GET() {
  const pads = await prisma.launchpad.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      slug: true,
      name: true,
      description: true,
      logoId: true,
      quoteSymbol: true,
      feeBps: true,
      initialMcUsd: true,
      migrationMcUsd: true,
      createdAt: true,
      _count: { select: { tokens: { where: { status: 'live' } } } },
    },
  });
  return NextResponse.json({ launchpads: pads });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      slug,
      name,
      description,
      ownerWallet,
      configKey,
      quoteSymbol,
      feeBps,
      initialMcUsd,
      migrationMcUsd,
      logoBase64,
      logoMime,
      accentColor,
      twitter,
      telegram,
      website,
      txSig,
    } = body || {};

    if (typeof slug !== 'string' || !SLUG_RE.test(slug))
      return err('subdominio invalido (3-32 chars, a-z, 0-9 e hifen)');
    if (RESERVED_SLUGS.includes(slug)) return err('subdominio reservado');
    if (!name || String(name).length > 60) return err('nome invalido');
    if (!ownerWallet || !configKey || !txSig) return err('campos faltando');

    const quote = QUOTES[quoteSymbol as QuoteSymbol];
    if (!quote) return err('quote invalido');
    const fee = Number(feeBps);
    if (!(fee >= MIN_FEE_BPS && fee <= MAX_FEE_BPS)) return err('fee fora do limite');
    const mc0 = Number(initialMcUsd);
    const mc1 = Number(migrationMcUsd);
    if (!(mc0 >= MIN_INITIAL_MC_USD && mc0 <= MAX_INITIAL_MC_USD))
      return err('MC inicial fora do limite');
    if (!(mc1 >= mc0 * MIN_MIGRATION_RATIO)) return err('MC final baixo demais');

    const exists = await prisma.launchpad.findFirst({
      where: { OR: [{ slug }, { configKey }] },
    });
    if (exists) return err('subdominio ou config ja registrado');

    // Verificacao on-chain: config real, feeClaimer = treasury, taxa paga.
    const onchain = await verifyLaunchpadConfig(configKey);
    if (onchain.quoteMint !== quote.mint)
      return err('quote do config nao bate com o informado');
    if (onchain.feeBps !== fee)
      return err(`fee do config on-chain (${onchain.feeBps} bps) nao bate`);
    await verifyCreationPayment(txSig);

    let logoId: string | undefined;
    if (logoBase64 && logoMime) {
      const buf = Buffer.from(String(logoBase64), 'base64');
      if (buf.length > 1_500_000) return err('logo maior que 1.5MB');
      if (!/^image\/(png|jpe?g|gif|webp)$/.test(logoMime)) return err('formato de logo invalido');
      const img = await prisma.image.create({
        data: { mime: logoMime, data: buf },
      });
      logoId = img.id;
    }

    const pad = await prisma.launchpad.create({
      data: {
        slug,
        name: String(name),
        description: description ? String(description).slice(0, 500) : null,
        ownerWallet: String(ownerWallet),
        configKey: String(configKey),
        quoteMint: quote.mint,
        quoteSymbol: quote.symbol,
        feeBps: fee,
        initialMcUsd: mc0,
        migrationMcUsd: mc1,
        logoId,
        accentColor: accentColor ? String(accentColor).slice(0, 16) : null,
        twitter: clean(twitter),
        telegram: clean(telegram),
        website: clean(website),
        createTx: String(txSig),
      },
    });
    return NextResponse.json({ ok: true, slug: pad.slug });
  } catch (e: any) {
    return err(e?.message || 'erro interno', 500);
  }
}

function clean(v: unknown): string | null {
  if (!v) return null;
  return String(v).slice(0, 200);
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
