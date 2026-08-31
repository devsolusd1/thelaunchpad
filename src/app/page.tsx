import Link from 'next/link';
import { prisma } from '@/lib/db';
import Nav from '@/components/Nav';
import { PadLockup, PadMark } from '@/components/brand';
import CountUp from '@/components/home/CountUp';
import PadsExplorer, { PadCard } from '@/components/home/PadsExplorer';
import HowItWorks from '@/components/home/HowItWorks';
import { shotHtml } from '@/components/home/shot-html';
import { payoutTotalsByPad } from '@/lib/padstats';
import {
  SITE_NAME,
  DISPLAY_DOMAIN,
  CREATION_FEE_SOL,
  TREASURY_WALLET,
  launchpadUrl,
  SOL_MINT,
} from '@/lib/env';

export const revalidate = 0;

const CHECK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 13 4 4L19 7" />
  </svg>
);
const ARROW = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h15" /><path d="m13 6 6 6-6 6" />
  </svg>
);

export default async function Home() {
  const [pads, tokenCount, buybacks, payoutTotals, recentTokens, recentPayouts] =
    await Promise.all([
      prisma.launchpad.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { tokens: { where: { status: 'live' } } } },
        },
      }),
      prisma.token.count({ where: { status: 'live' } }),
      prisma.buyback.findMany(),
      payoutTotalsByPad(),
      prisma.token.findMany({
        where: { status: 'live' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { launchpad: { select: { name: true } } },
      }),
      prisma.feePayout.findMany({
        orderBy: { createdAt: 'desc' },
        take: 4,
        include: { launchpad: { select: { slug: true } } },
      }),
    ]);

  const solCollected =
    pads.filter((p) => p.ownerWallet !== TREASURY_WALLET).length *
    CREATION_FEE_SOL;
  const solToOwners =
    [...payoutTotals.entries()].reduce((s, [, v]) => s + Number(v), 0) / 1e9;
  const solBurned =
    buybacks.reduce((s, b) => s + Number(b.spentLamports), 0) / 1e9;

  const cards: PadCard[] = pads.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    feePct: p.feeBps / 100,
    quoteSymbol: p.quoteSymbol,
    tokens: p._count.tokens,
    paidSol:
      p.quoteMint === SOL_MINT
        ? Number(payoutTotals.get(p.id) || 0n) / 1e9
        : Number(payoutTotals.get(p.id) || 0n) / 1e6,
    owner: p.ownerWallet,
    logoUrl: p.logoId ? `/api/img/${p.logoId}` : null,
    color: p.accentColor || '#d9631c',
    xVerified: p.xVerified,
    xHandle: p.xHandle,
    subUrl: launchpadUrl(p.slug),
    subHost: `${p.slug}.${DISPLAY_DOMAIN}`,
    createdAt: p.createdAt.toISOString(),
  }));

  /* ticker: eventos reais + fatos do protocolo pra completar */
  const events: string[] = [];
  for (const t of recentTokens)
    events.push(`<b>$${t.symbol}</b> launched on ${t.launchpad.name}`);
  for (const p of recentPayouts)
    events.push(
      `<b>${p.launchpad.slug}</b> paid <em>${(Number(p.amountRaw) / 1e9).toFixed(3)} SOL</em> to its owner`
    );
  for (const p of pads.slice(0, 3)) events.push(`<b>${p.slug}</b> pad created`);
  if (solBurned > 0)
    events.push(`<em>${solBurned.toFixed(2)} SOL</em> bought &amp; burned`);
  events.push(
    '<b>50%</b> of every fee goes to pad owners',
    'LP locks forever on graduation',
    `<b>${CREATION_FEE_SOL} SOL</b> creation fee → buyback &amp; burn`
  );
  const ticker = [...events, ...events];

  return (
    <main className="pg-home">
      <Nav title={SITE_NAME} siteLinks />

      {/* ══ hero ══ */}
      <div className="t-top">
        <div className="t-in">
          <header className="t-hero">
            <a className="t-pill" href="#how-it-works">
              <b>LIVE</b> The 50/50 fee split is live on mainnet{' '}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></svg>
            </a>
            <h1>
              Create your own <em>launchpad</em> on Solana
            </h1>
            <p>
              Your subdomain, your brand, your curve. Pick the fee, the
              starting market cap and the quote token — then keep{' '}
              <b>half of every trading fee</b> from every token launched on
              your pad.
            </p>
            <div className="t-ctas">
              <Link className="t-btn" href="/create">
                Create launchpad <span className="t-price">{CREATION_FEE_SOL} SOL</span>
                {ARROW}
              </Link>
              <a className="t-btn ghost" href="#launchpads">
                Explore pads
              </a>
            </div>
            <p className="fine">
              The {CREATION_FEE_SOL} SOL creation fee is used to buy back
              &amp; burn the main token.
            </p>
            <ul className="t-trust">
              <li>{CHECK}Audited Meteora DBC</li>
              <li>{CHECK}LP locked on graduation</li>
              <li>{CHECK}No code, no deploy</li>
            </ul>
          </header>

          {/* product shot ilustrativo (Nounspad, do mockup) */}
          <div dangerouslySetInnerHTML={{ __html: shotHtml(DISPLAY_DOMAIN) }} />

          {/* stats reais */}
          <div className="t-stats">
            <div className="t-stat">
              <CountUp className="n" to={pads.length} />
              <div className="l">Launchpads</div>
            </div>
            <div className="t-stat">
              <CountUp className="n" to={tokenCount} />
              <div className="l">Tokens launched</div>
            </div>
            <div className="t-stat">
              <CountUp className="n" to={solCollected} dec={1} suffix=" SOL" />
              <div className="l">Creation fees</div>
            </div>
            <div className="t-stat">
              <CountUp className="n hot" to={solToOwners} dec={2} suffix=" SOL" />
              <div className="l">Paid to pad owners</div>
            </div>
            <div className="t-stat">
              <CountUp className="n" to={solBurned} dec={2} suffix=" SOL" />
              <div className="l">Bought &amp; burned</div>
            </div>
          </div>
        </div>

        {/* ticker */}
        <div className="t-ticker">
          <div className="t-track">
            {ticker.map((e, i) => (
              <span key={i}>
                <span dangerouslySetInnerHTML={{ __html: e }} />
                <i></i>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ pads reais ══ */}
      <section className="t-pads" id="launchpads">
        <div className="t-in">
          <PadsExplorer pads={cards} />
        </div>
      </section>

      {/* ══ how it works (ilustrativo) ══ */}
      <HowItWorks domain={DISPLAY_DOMAIN} />

      {/* ══ features ══ */}
      <section className="t-feat">
        <div className="t-in">
          <div className="t-feat-g">
            <div className="t-fcard">
              <div className="t-ficon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18" /><path d="M5 8h9a3 3 0 0 1 0 6H5" /></svg>
              </div>
              <h3>50/50 fees</h3>
              <p>
                Every token&apos;s trading fee accrues to the protocol as a
                partner fee. A public bot splits it: half to the platform,
                half to the pad owner&apos;s wallet. The full payout history
                sits on each pad&apos;s dashboard.
              </p>
            </div>
            <div className="t-fcard">
              <div className="t-ficon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M20.4 12a8.4 8.4 0 0 1-8.4 8.4 8.4 8.4 0 0 1-7.3-4.2" /><path d="M3.6 12A8.4 8.4 0 0 1 12 3.6a8.4 8.4 0 0 1 7.3 4.2" /><path d="M19.5 3.7v4.3h-4.3" /><path d="M4.5 20.3V16h4.3" /></svg>
              </div>
              <h3>$PAD</h3>
              <p>
                Every {CREATION_FEE_SOL} SOL creation fee goes straight into
                buying and burning the platform token. More launchpads, more
                burn — the supply only moves one way.{' '}
                <Link href="/pad" style={{ color: 'var(--accent)', fontWeight: 900, textDecoration: 'none' }}>
                  See $PAD →
                </Link>
              </p>
            </div>
            <div className="t-fcard">
              <div className="t-ficon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V4" /><path d="M4 20h16" /><path d="M7 17c2.5 0 3.5-2.4 5-6s2.5-6 5-6" /></svg>
              </div>
              <h3>Meteora DBC</h3>
              <p>
                Audited dynamic bonding curves by Meteora. On graduation,
                liquidity migrates to a DAMM v2 pool with the LP permanently
                locked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA band ══ */}
      <section className="t-band">
        <div className="t-in">
          <div className="t-band-card">
            <h2>
              Your pad could be earning
              <br />
              while you read this
            </h2>
            <p>
              One transaction, one subdomain, and half of every trading fee
              from every token launched on it. No code, no team, no
              permission.
            </p>
            <div className="acts">
              <Link className="b1" href="/create">
                Create launchpad · {CREATION_FEE_SOL} SOL {ARROW}
              </Link>
              <a className="b2" href="#launchpads">
                Explore pads
              </a>
            </div>
            <div className="mini">
              <div><div className="n">{pads.length}</div><div className="l">Launchpads</div></div>
              <div><div className="n">{tokenCount}</div><div className="l">Tokens</div></div>
              <div><div className="n">{solToOwners.toFixed(2)} SOL</div><div className="l">Paid to owners</div></div>
              <div><div className="n">{solBurned.toFixed(2)} SOL</div><div className="l">Burned</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ footer ══ */}
      <footer className="bigfoot">
        <div className="t-in">
          <div className="bf-grid">
            <div className="bf-brand">
              <div className="logo-row">
                <PadLockup height={30} title={SITE_NAME} />
              </div>
              <p>
                The launchpad of launchpads on Solana. You set the curve, you
                keep half the fees, forever.
              </p>
              <span className="status"><i></i>All systems operational</span>
            </div>

            <div className="bf-col">
              <h4>Product</h4>
              <Link href="/create">Create a launchpad</Link>
              <a href="#launchpads">Explore pads</a>
              <a href="#how-it-works">How it works</a>
              <Link href="/pad">$PAD token</Link>
              <a>Custom domains<span className="tagsoon">soon</span></a>
            </div>

            <div className="bf-col">
              <h4>Learn</h4>
              <Link href="/docs">Docs</Link>
              <Link href="/docs#curve">Bonding curves 101</Link>
              <Link href="/docs#fees">The 50/50 split</Link>
              <Link href="/docs#trading">Graduation &amp; DAMM v2</Link>
            </div>

            <div className="bf-col">
              <h4>Legal</h4>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/docs#faq">FAQ</Link>
            </div>

            <div className="bf-burn">
              <div className="k">
                <PadMark size={14} />
                Bought &amp; burned
              </div>
              <div className="n">{solBurned.toFixed(2)} SOL</div>
              <p className="s">
                Every creation fee buys the platform token on the market and
                sends it to a dead address.
              </p>
            </div>
          </div>

          <p className="bf-note">
            <b>Nothing here is financial advice.</b> {SITE_NAME} is a
            non-custodial software interface. Every token you see was created
            by a user, not by us — we do not issue, endorse, audit or vouch
            for any of them, and we never hold your keys or your funds. Tokens
            on bonding curves are highly speculative and frequently go to
            zero. Figures shown in simulators and examples are illustrative,
            not projections. Only commit what you can afford to lose entirely.
          </p>

          <div className="bf-bottom">
            <span>© 2026 {SITE_NAME}. All rights reserved.</span>
            <div className="bf-legal">
              <Link href="/terms">Terms</Link>
              <Link href="/docs">Docs</Link>
              <Link href="/pad">$PAD</Link>
            </div>
            <span className="netpill"><i></i>Solana Mainnet · Meteora DBC</span>
          </div>
        </div>
        <div className="bf-wm" aria-hidden="true">
          {SITE_NAME.toUpperCase()}
        </div>
      </footer>
    </main>
  );
}
