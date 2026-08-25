import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Nav from '@/components/Nav';
import { fmtUsd, shortAddr } from '@/lib/format';

export const revalidate = 0;

export default async function LaunchpadHome({
  params,
}: {
  params: { site: string };
}) {
  const pad = await prisma.launchpad.findUnique({
    where: { slug: params.site.toLowerCase() },
    include: {
      tokens: { where: { status: 'live' }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!pad) notFound();

  const main = pad.mainTokenMint
    ? pad.tokens.find((t) => t.mint === pad.mainTokenMint)
    : null;

  return (
    <main>
      <Nav
        title={pad.name}
        logoUrl={pad.logoId ? `/api/img/${pad.logoId}` : null}
        rightExtra={
          <a href="/dashboard" className="btn-outline hidden md:inline-flex">
            Fees
          </a>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-black text-white md:text-5xl">
              {pad.name}
            </h1>
            {pad.description && (
              <p className="mt-2 max-w-xl text-gray-400">{pad.description}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Badge>{pad.feeBps / 100}% fee</Badge>
              <Badge>{pad.quoteSymbol} quote</Badge>
              <Badge>
                {fmtUsd(pad.initialMcUsd)} → {fmtUsd(pad.migrationMcUsd)}
              </Badge>
              <Badge>owner {shortAddr(pad.ownerWallet)}</Badge>
            </div>
            <div className="mt-2 flex gap-3 text-sm text-accent">
              {pad.twitter && <a href={pad.twitter} target="_blank">Twitter</a>}
              {pad.telegram && <a href={pad.telegram} target="_blank">Telegram</a>}
              {pad.website && <a href={pad.website} target="_blank">Website</a>}
            </div>
          </div>
          <a href="/create" className="btn-green text-lg">
            + Launch token
          </a>
        </div>

        {main && main.mint && (
          <a
            href={`/t/${main.mint}`}
            className="card mt-8 flex items-center gap-4 border-accent/50 p-5 hover:border-accent"
          >
            {main.imageId && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/img/${main.imageId}`}
                alt=""
                className="h-14 w-14 rounded-lg object-cover"
              />
            )}
            <div>
              <div className="text-xs uppercase tracking-wide text-accent">
                Main token
              </div>
              <div className="text-lg font-bold text-white">
                {main.name}{' '}
                <span className="text-gray-400">${main.symbol}</span>
              </div>
            </div>
          </a>
        )}

        <h2 className="mt-12 mb-4 text-xl font-bold text-white">
          Tokens ({pad.tokens.length})
        </h2>
        {pad.tokens.length === 0 ? (
          <div className="card p-10 text-center text-gray-400">
            No tokens yet. Be the first to launch here.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pad.tokens.map((t) => (
              <a
                key={t.id}
                href={`/t/${t.mint}`}
                className="card group p-4 transition-colors hover:border-accent2"
              >
                <div className="flex items-center gap-3">
                  {t.imageId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/img/${t.imageId}`}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-panel2 text-xl font-black text-accent2">
                      {t.symbol.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-bold text-white group-hover:text-accent2">
                      {t.name}
                    </div>
                    <div className="text-sm text-gray-400">${t.symbol}</div>
                  </div>
                </div>
                {t.description && (
                  <p className="mt-3 line-clamp-2 text-xs text-gray-500">
                    {t.description}
                  </p>
                )}
                <div className="mt-3 font-mono text-[10px] text-gray-600">
                  {t.mint}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-panel2 px-2 py-0.5 text-gray-300">
      {children}
    </span>
  );
}
