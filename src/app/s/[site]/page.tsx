import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Nav from '@/components/Nav';
import OwnerPanel from '@/components/OwnerPanel';
import { launchpadUrl } from '@/lib/env';
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

      {/* hub central da launchpad: logo grande, nome, descricao, acoes */}
      <section className="mx-auto max-w-3xl px-4 pb-6 pt-14 text-center">
        {pad.logoId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/img/${pad.logoId}`}
            alt=""
            className="mx-auto h-28 w-28 rounded-3xl border border-line object-cover shadow-lg md:h-32 md:w-32"
          />
        ) : (
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border border-line bg-panel2 text-5xl font-black text-accent md:h-32 md:w-32">
            {pad.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="mt-5 text-3xl font-black text-white md:text-5xl">
          {pad.name}
        </h1>
        {pad.description && (
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            {pad.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
          <Badge>{pad.feeBps / 100}% fee</Badge>
          <Badge>{pad.quoteSymbol} quote</Badge>
          <Badge>
            {fmtUsd(pad.initialMcUsd)} → {fmtUsd(pad.migrationMcUsd)}
          </Badge>
          <Badge>owner {shortAddr(pad.ownerWallet)}</Badge>
        </div>

        {(pad.twitter || pad.telegram || pad.website) && (
          <div className="mt-3 flex justify-center gap-4 text-sm text-accent">
            {pad.twitter && <a href={pad.twitter} target="_blank">Twitter</a>}
            {pad.telegram && <a href={pad.telegram} target="_blank">Telegram</a>}
            {pad.website && <a href={pad.website} target="_blank">Website</a>}
          </div>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="/create" className="btn-green px-8 py-3 text-lg">
            + Launch token
          </a>
          <a href="/dashboard" className="btn-outline px-6 py-3 text-lg">
            Fees
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <OwnerPanel
          slug={pad.slug}
          ownerWallet={pad.ownerWallet}
          subdomainUrl={launchpadUrl(pad.slug)}
        />

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

        <h2 className="mt-10 mb-4 text-xl font-bold text-white">
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
