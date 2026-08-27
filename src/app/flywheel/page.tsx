import Nav from '@/components/Nav';
import { SITE_NAME, CREATION_FEE_SOL } from '@/lib/env';

export const metadata = { title: `Flywheel — ${SITE_NAME}` };

export default function FlywheelPage() {
  return (
    <main>
      <Nav title={SITE_NAME} siteLinks />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-4xl font-black text-white">The Flywheel</h1>
        <p className="mt-3 max-w-2xl text-gray-400">
          Every launchpad created and every trade on every token feeds the same
          engine. Here is exactly where each lamport goes.
        </p>

        {/* ---------------- organograma das fees de trade ---------------- */}
        <h2 className="mt-12 text-2xl font-bold text-white">
          Where trading fees go
        </h2>
        <div className="card mt-4 p-6">
          <FlowBox accent title="Trade on any token" subtitle="fee set by the launchpad: 2% – 10% of every buy & sell" />
          <Branch>
            <FlowBox
              title="20% → Meteora protocol"
              subtitle="fixed cut of the DBC program"
              dim
            />
            <FlowBox title="80% → claimable by the platform" subtitle="collected in SOL or USDC (the pad's quote)" />
          </Branch>
          <div className="ml-10 mt-2 border-l-2 border-line pl-6">
            <Branch>
              <FlowBox
                accent2
                title="50% → launchpad owner"
                subtitle="paid straight to the owner's wallet — public payout history on each pad's dashboard"
              />
              <FlowBox
                title="50% → platform treasury"
                subtitle="funds operations and the platform token"
              />
            </Branch>
          </div>
        </div>

        {/* ---------------- loop do buyback ---------------- */}
        <h2 className="mt-12 text-2xl font-bold text-white">
          Buyback &amp; burn loop
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Creating a launchpad costs {CREATION_FEE_SOL} SOL. That fee does not
          sit in a wallet — 100% of it buys the platform token on the open
          market and burns it. Creating a pad is, mechanically, buying the
          token.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <LoopStep n={1} title="New launchpad" text={`${CREATION_FEE_SOL} SOL creation fee goes to the treasury`} />
          <LoopStep n={2} title="Buyback" text="the treasury market-buys the platform token" />
          <LoopStep n={3} title="Burn" text="100% of the bought tokens are burned — supply only goes down" />
          <LoopStep n={4} title="Momentum" text="scarcer token + more pads + more volume → more creators arrive" />
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="text-accent">↻</span> step 4 feeds step 1 — that is
          the flywheel
        </div>

        <div className="card mt-12 flex flex-col items-center gap-4 p-8 text-center">
          <h3 className="text-xl font-bold text-white">
            Ready to spin it?
          </h3>
          <a href="/create" className="btn-primary text-lg">
            Create your launchpad
          </a>
        </div>
      </div>
    </main>
  );
}

function FlowBox({
  title,
  subtitle,
  accent,
  accent2,
  dim,
}: {
  title: string;
  subtitle: string;
  accent?: boolean;
  accent2?: boolean;
  dim?: boolean;
}) {
  const border = accent
    ? 'border-accent'
    : accent2
      ? 'border-accent2'
      : 'border-line';
  return (
    <div
      className={`rounded-xl border ${border} bg-panel2/60 px-4 py-3 ${dim ? 'opacity-70' : ''}`}
    >
      <div className="font-bold text-white">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}

function Branch({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-4 mt-2 grid gap-2 border-l-2 border-line pl-6 md:grid-cols-2">
      {children}
    </div>
  );
}

function LoopStep({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="card relative p-5">
      <div className="absolute -top-3 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-black text-cream">
        {n}
      </div>
      <div className="mt-2 font-bold text-white">{title}</div>
      <p className="mt-1 text-sm text-gray-400">{text}</p>
    </div>
  );
}
