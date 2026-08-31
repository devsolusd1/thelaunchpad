import Nav from '@/components/Nav';
import {
  SITE_NAME,
  CREATION_FEE_SOL,
  MIN_INITIAL_MC_USD,
  MAX_INITIAL_MC_USD,
  MIN_FEE_BPS,
  MAX_FEE_BPS,
  DISPLAY_DOMAIN,
} from '@/lib/env';

export const metadata = { title: `Docs — ${SITE_NAME}` };

const SECTIONS = [
  ['overview', 'Overview'],
  ['create', 'Create a launchpad'],
  ['curve', 'Curve & pricing'],
  ['launch', 'Launching tokens'],
  ['trading', 'Trading & graduation'],
  ['fees', 'Fees & payouts'],
  ['flywheel', 'Buyback & burn'],
  ['faq', 'FAQ'],
] as const;

export default function DocsPage() {
  return (
    <main>
      <Nav title={SITE_NAME} siteLinks />
      <div className="mx-auto flex max-w-6xl gap-10 px-4 py-12">
        {/* sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 space-y-1 text-sm">
            {SECTIONS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="block rounded-lg px-3 py-2 text-gray-400 hover:bg-panel2 hover:text-accent"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* conteudo */}
        <article className="min-w-0 max-w-3xl space-y-12">
          <Section id="overview" title="Overview">
            <p>
              {SITE_NAME} is a launchpad of launchpads on Solana. Anyone can
              create their own branded launchpad on a subdomain
              (yourname.{DISPLAY_DOMAIN}), define its bonding-curve economics
              once, and earn half of every trading fee from every token
              launched on it. All pools run on Meteora&apos;s audited Dynamic
              Bonding Curve (DBC) program — the platform never holds user
              funds.
            </p>
          </Section>

          <Section id="create" title="Create a launchpad">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Pick a subdomain, name, logo and description.</li>
              <li>
                Choose your curve: trading fee ({MIN_FEE_BPS / 100}%–
                {MAX_FEE_BPS / 100}%), quote token (SOL or USDC), starting
                market cap (${MIN_INITIAL_MC_USD.toLocaleString()}–$
                {MAX_INITIAL_MC_USD.toLocaleString()}) and graduation market
                cap (no upper limit).
              </li>
              <li>
                Sign one transaction: it creates your on-chain DBC config and
                pays the {CREATION_FEE_SOL} SOL creation fee (plus ~0.03 SOL
                of rent). The fee is used entirely for platform-token buyback
                &amp; burn.
              </li>
            </ol>
            <p>
              Your pad is live immediately at its direct link
              (/s/your-subdomain). The subdomain itself may take a short while
              to resolve for brand-new pads while DNS settles.
            </p>
          </Section>

          <Section id="curve" title="Curve & pricing">
            <p>
              Every token launched on your pad uses the same curve — the one
              you defined at creation. The starting market cap sets the entry
              price; the graduation market cap sets the point where the token
              leaves the curve and migrates to a Meteora DAMM v2 pool. Market
              caps are entered in USD and converted to your quote token at
              creation time. Supply is fixed at 1B tokens (9 decimals), mint
              and freeze authority revoked — no rugs by design.
            </p>
          </Section>

          <Section id="launch" title="Launching tokens">
            <p>
              Anyone can launch a token on any pad: name, ticker, image,
              links, and an optional <b>dev buy</b> — your own first purchase
              executed in the same transaction as the mint, so nobody can
              front-run you. Token metadata is pinned to IPFS.
            </p>
          </Section>

          <Section id="trading" title="Trading & graduation">
            <p>
              Buys and sells happen directly against the bonding curve — no
              order book, no LPs, liquidity is guaranteed by the curve
              itself. When the token&apos;s market cap reaches the pad&apos;s
              graduation target, the curve closes and liquidity migrates
              automatically to a Meteora DAMM v2 pool with the LP{' '}
              <b>permanently locked</b>. From then on it trades like any other
              Solana token (Jupiter, aggregators, etc.).
            </p>
          </Section>

          <Section id="fees" title="Fees & payouts">
            <p>Every trade pays the pad&apos;s fee (2%–10%). Of that:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>20% goes to the Meteora protocol (fixed);</li>
              <li>
                of the remaining 80%: <b>half goes to the launchpad owner</b>,
                half to the platform treasury.
              </li>
            </ul>
            <p>
              Owner payouts are made automatically by the platform bot and
              recorded publicly — every pad has a dashboard
              (/dashboard on the pad) showing lifetime fees, unclaimed fees
              and the full payout history with transaction links.
            </p>
          </Section>

          <Section id="flywheel" title="Buyback & burn">
            <p>
              100% of every {CREATION_FEE_SOL} SOL creation fee market-buys
              the platform token and burns it. Supply only goes down; every
              new launchpad is mechanical buy pressure. See the{' '}
              <a href="/pad" className="text-accent underline">
                $PAD page
              </a>{' '}
              for the full diagram.
            </p>
          </Section>

          <Section id="faq" title="FAQ">
            <Faq q="Do you custody my funds?">
              No. Launchpad configs and pools live on Meteora&apos;s DBC
              program; trades settle wallet-to-curve. The platform only
              claims protocol fees.
            </Faq>
            <Faq q="Can the fee split change after I create my pad?">
              The on-chain fee and curve are immutable once the config is
              created. The 50/50 owner split is a platform commitment,
              enforced by the public payout history.
            </Faq>
            <Faq q="What happens if a token graduates?">
              Liquidity migrates to DAMM v2 with the LP permanently locked.
              Fees from the migrated pool keep flowing into the same 50/50
              split.
            </Faq>
            <Faq q="Can I change my launchpad's logo?">
              Yes — connect the owner wallet on your pad and use Owner tools.
              Changing it only requires a free message signature.
            </Faq>
          </Section>
        </article>
      </div>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-300">
        {children}
      </div>
    </section>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="font-bold text-white">{q}</div>
      <p className="mt-1 text-sm text-gray-400">{children}</p>
    </div>
  );
}
