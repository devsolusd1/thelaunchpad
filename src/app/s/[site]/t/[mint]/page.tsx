import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Nav from '@/components/Nav';
import TradePanel from '@/components/TradePanel';
import { QUOTES } from '@/lib/env';
import { shortAddr } from '@/lib/format';

export const revalidate = 0;

export default async function TokenPage({
  params,
}: {
  params: { site: string; mint: string };
}) {
  const pad = await prisma.launchpad.findUnique({
    where: { slug: params.site.toLowerCase() },
  });
  if (!pad) notFound();
  const token = await prisma.token.findFirst({
    where: { mint: params.mint, launchpadId: pad.id, status: 'live' },
  });
  if (!token || !token.mint || !token.pool) notFound();

  const quote = pad.quoteSymbol === 'USDC' ? QUOTES.USDC : QUOTES.SOL;

  return (
    <main>
      <Nav
        title={pad.name}
        logoUrl={pad.logoId ? `/api/img/${pad.logoId}` : null}
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center gap-4">
          {token.imageId && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/img/${token.imageId}`}
              alt=""
              className="h-14 w-14 rounded-xl object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-black text-white">
              {token.name}{' '}
              <span className="text-gray-400">${token.symbol}</span>
            </h1>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="font-mono">{shortAddr(token.mint, 6)}</span>
              {token.website && <a className="text-accent" href={token.website} target="_blank">website</a>}
              {token.twitter && <a className="text-accent" href={token.twitter} target="_blank">twitter</a>}
              {token.telegram && <a className="text-accent" href={token.telegram} target="_blank">telegram</a>}
              <a
                className="text-accent"
                href={`https://solscan.io/token/${token.mint}`}
                target="_blank"
              >
                solscan
              </a>
            </div>
          </div>
        </div>

        {token.description && (
          <p className="mt-3 max-w-3xl text-sm text-gray-400">
            {token.description}
          </p>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <iframe
                src={`https://www.gmgn.cc/kline/sol/${token.mint}`}
                className="h-[480px] w-full"
                title="chart"
              />
            </div>
            <div className="mt-2 flex gap-3 text-xs text-gray-500">
              <a
                className="hover:text-accent"
                href={`https://dexscreener.com/solana/${token.pool}`}
                target="_blank"
              >
                DexScreener
              </a>
              <a
                className="hover:text-accent"
                href={`https://gmgn.ai/sol/token/${token.mint}`}
                target="_blank"
              >
                GMGN
              </a>
              <a
                className="hover:text-accent"
                href={`https://jup.ag/tokens/${token.mint}`}
                target="_blank"
              >
                Jupiter
              </a>
            </div>
          </div>

          <TradePanel
            pool={token.pool}
            mint={token.mint}
            symbol={token.symbol}
            quoteSymbol={quote.symbol}
            quoteMint={quote.mint}
            quoteDecimals={quote.decimals}
            feeBps={pad.feeBps}
          />
        </div>
      </div>
    </main>
  );
}
