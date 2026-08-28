import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import PadNav from '@/components/pad/PadNav';
import CreateTokenForm from '@/components/CreateTokenForm';
import { SITE_NAME, ROOT_DOMAIN } from '@/lib/env';

export const revalidate = 0;

export default async function CreateTokenPage({
  params,
  searchParams,
}: {
  params: { site: string };
  searchParams?: { main?: string };
}) {
  const pad = await prisma.launchpad.findUnique({
    where: { slug: params.site.toLowerCase() },
  });
  if (!pad) notFound();

  return (
    <main>
      <PadNav
        siteName={SITE_NAME}
        siteUrl={`${ROOT_DOMAIN.includes('localhost') ? 'http' : 'https'}://${ROOT_DOMAIN}`}
        slug={pad.slug}
        padName={pad.name}
        logoUrl={pad.logoId ? `/api/img/${pad.logoId}` : null}
        ownerWallet={pad.ownerWallet}
      />
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-3xl font-black text-white">Launch token</h1>
        <p className="mt-2 text-sm text-gray-400">
          This launchpad&apos;s curve: {pad.feeBps / 100}% fee ·{' '}
          {pad.quoteSymbol} quote · MC ${pad.initialMcUsd.toLocaleString()} → $
          {pad.migrationMcUsd.toLocaleString()}
        </p>
        {pad.creatorFeePct > 0 && (
          <div className="card mt-4 border-accent/50 p-4 text-sm">
            <b className="text-accent">You earn fees on your own token.</b>{' '}
            <span className="text-gray-400">
              This pad shares {pad.creatorFeePct}% of every trade&apos;s net
              fee with the token creator — paid on-chain by the protocol,
              claimable by you anytime on your token&apos;s page.
            </span>
          </div>
        )}
        <div className="mt-8">
          <CreateTokenForm
            slug={pad.slug}
            configKey={pad.configKey}
            quoteMint={pad.quoteMint}
            quoteSymbol={pad.quoteSymbol}
            quoteDecimals={pad.quoteSymbol === 'USDC' ? 6 : 9}
            asMain={searchParams?.main === '1'}
            padName={pad.name}
          />
        </div>
      </div>
    </main>
  );
}
