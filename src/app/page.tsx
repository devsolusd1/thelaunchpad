import Link from 'next/link';
import { prisma } from '@/lib/db';
import Nav from '@/components/Nav';
import { SITE_NAME, CREATION_FEE_SOL, launchpadUrl } from '@/lib/env';
import { fmtUsd, shortAddr } from '@/lib/format';

export const revalidate = 0;

export default async function Home() {
  const [pads, tokenCount, buybacks] = await Promise.all([
    prisma.launchpad.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { tokens: { where: { status: 'live' } } } } },
    }),
    prisma.token.count({ where: { status: 'live' } }),
    prisma.buyback.findMany(),
  ]);

  const solCollected = pads.length * CREATION_FEE_SOL;
  const solBurned =
    buybacks.reduce((s, b) => s + Number(b.spentLamports), 0) / 1e9;

  return (
    <main>
      <Nav title={SITE_NAME} />

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-black text-white md:text-6xl">
          Launch your own <span className="text-accent">launchpad</span> on
          Solana
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-400">
          Your subdomain, your brand, your curve. You pick the fee (2–10%), the
          starting market cap and the quote token (SOL or USDC) — and earn{' '}
          <b className="text-accent2">half of every trading fee</b> from tokens
          launched on your pad. All on-chain via Meteora DBC.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/create" className="btn-primary text-lg">
            Create launchpad ({CREATION_FEE_SOL} SOL)
          </Link>
          <a href="#launchpads" className="btn-outline text-lg">
            Explore
          </a>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Launchpads" value={String(pads.length)} />
          <Stat label="Tokens launched" value={String(tokenCount)} />
          <Stat label="SOL collected" value={solCollected.toFixed(1)} />
          <Stat label="SOL bought & burned" value={solBurned.toFixed(2)} />
        </div>
      </section>

      <section id="launchpads" className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-6 text-2xl font-bold text-white">Launchpads</h2>
        {pads.length === 0 ? (
          <div className="card p-10 text-center text-gray-400">
            No launchpads yet — be the first to create one.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pads.map((p) => (
              <a
                key={p.slug}
                href={launchpadUrl(p.slug)}
                className="card group p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-center gap-3">
                  {p.logoId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/img/${p.logoId}`}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-panel2 text-xl">
                      🚀
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-white group-hover:text-accent">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.slug}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                    </div>
                  </div>
                </div>
                {p.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-gray-400">
                    {p.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <Badge>{p._count.tokens} tokens</Badge>
                  <Badge>{p.feeBps / 100}% fee</Badge>
                  <Badge>{p.quoteSymbol} quote</Badge>
                  <Badge>
                    {fmtUsd(p.initialMcUsd)} → {fmtUsd(p.migrationMcUsd)}
                  </Badge>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  owner: {shortAddr(p.ownerWallet)}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-line bg-panel/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          <div>
            <h3 className="font-bold text-white">💸 50/50 fees</h3>
            <p className="mt-2 text-sm text-gray-400">
              Every token&apos;s trading fee accrues to the protocol as partner
              fee. A public bot splits it: half to the platform, half to the
              launchpad owner&apos;s wallet. The payout history is visible on
              each launchpad&apos;s dashboard.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">🔥 Flywheel</h3>
            <p className="mt-2 text-sm text-gray-400">
              Every {CREATION_FEE_SOL} SOL launchpad-creation fee goes straight
              into buying &amp; burning the platform token. More launchpads,
              more burn.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">⚙️ Meteora DBC</h3>
            <p className="mt-2 text-sm text-gray-400">
              Audited dynamic bonding curves by Meteora. On graduation,
              liquidity migrates to a DAMM v2 pool with the LP permanently
              locked.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-panel2 px-2 py-0.5 text-gray-300">
      {children}
    </span>
  );
}
