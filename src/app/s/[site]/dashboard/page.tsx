import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import AdminClient, { AdminData } from '@/components/pad/AdminClient';
import { curveStats, padFees } from '@/lib/padstats';
import { SITE_NAME, ROOT_DOMAIN, SOL_MINT } from '@/lib/env';

export const revalidate = 0;

export default async function PadDashboard({
  params,
}: {
  params: { site: string };
}) {
  const pad = await prisma.launchpad.findUnique({
    where: { slug: params.site.toLowerCase() },
    include: {
      tokens: { where: { status: 'live' }, orderBy: { createdAt: 'desc' } },
      payouts: { orderBy: { createdAt: 'desc' }, take: 30 },
    },
  });
  if (!pad) notFound();

  const pools = pad.tokens.map((t) => t.pool!).filter(Boolean);
  const [stats, fees] = await Promise.all([
    curveStats(pools, pad.quoteSymbol),
    padFees(pad.slug, pools),
  ]);
  const dec = pad.quoteMint === SOL_MINT ? 1e9 : 1e6;
  const paid = pad.payouts.reduce((s, p) => s + Number(p.amountRaw), 0) / dec;

  const data: AdminData = {
    siteName: SITE_NAME,
    rootDomain: ROOT_DOMAIN,
    slug: pad.slug,
    name: pad.name,
    description: pad.description,
    ownerWallet: pad.ownerWallet,
    feePct: pad.feeBps / 100,
    quoteSymbol: pad.quoteSymbol,
    initialMcUsd: pad.initialMcUsd,
    migrationMcUsd: pad.migrationMcUsd,
    accentColor: pad.accentColor,
    gaId: pad.gaId,
    twitter: pad.twitter,
    telegram: pad.telegram,
    website: pad.website,
    logoUrl: pad.logoId ? `/api/img/${pad.logoId}` : null,
    mainTokenMint: pad.mainTokenMint,
    xVerified: pad.xVerified,
    xHandle: pad.xHandle,
    stats: {
      tokens: pad.tokens.length,
      graduated: pad.tokens.filter((t) => t.pool && stats.get(t.pool)?.migrated).length,
      paid,
      unclaimed: Number(fees.unclaimed) / dec,
      lifetime: Number(fees.lifetime) / dec,
    },
    tokens: pad.tokens.map((t) => ({
      mint: t.mint!,
      name: t.name,
      symbol: t.symbol,
      imageUrl: t.imageId ? `/api/img/${t.imageId}` : null,
      mcUsd: t.pool ? (stats.get(t.pool)?.mcUsd ?? null) : null,
      migrated: !!(t.pool && stats.get(t.pool)?.migrated),
    })),
    payouts: pad.payouts.map((p) => ({
      date: p.createdAt.toISOString(),
      amountUi: Number(p.amountRaw) / dec,
      txSig: p.txSig,
    })),
  };

  return <AdminClient data={data} />;
}
