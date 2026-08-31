import Nav from '@/components/Nav';
import EarningsCalculator from '@/components/EarningsCalculator';
import { SITE_NAME, CREATION_FEE_SOL, ROOT_DOMAIN } from '@/lib/env';
import { WALLET_ICONS } from '@/components/wallet-icons';

export const metadata = { title: `Flywheel — ${SITE_NAME}` };

const OWNER = '7xKp...9fQa';

export default function FlywheelPage() {
  return (
    <main>
      <Nav title={SITE_NAME} siteLinks />
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* ------------------------------------------------ dinheiro ------ */}
        <h1 className="text-4xl font-black text-white">Where the money goes</h1>
        <p className="mt-3 max-w-xl text-gray-400">
          The split is not a promise in a doc, it&apos;s the shape of the
          money. One fee comes in, two payments go out.
        </p>

        <div className="card mt-6 p-6 md:p-10">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-stretch md:gap-0">
            {/* traders */}
            <FlowCard title="Traders" subtitle="buys · sells · 24/7" />
            <Arrow label="volume" />
            {/* curva */}
            <FlowCard
              title="FrogPad's curve"
              subtitle="Meteora DBC · on-chain"
              accent
              chip="fee 3.5%"
            />
            {/* bifurcacao */}
            <Fork />
            <div className="flex flex-col justify-between gap-4">
              <FlowCard
                title={SITE_NAME}
                subtitle="keeps the lights on"
              />
              <FlowCard
                title={OWNER}
                subtitle="your wallet · paid automatically"
                accent
                titleAccent
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ calculadora --- */}
        <div className="mt-8">
          <EarningsCalculator />
        </div>

        {/* ------------------------------------------------ walkthrough --- */}
        <div className="mt-20">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">
            How it works
          </div>
          <h2 className="mt-1 text-3xl font-black text-white md:text-4xl">
            Watch a pad get built:{' '}
            <span className="text-accent">FrogPad</span>
          </h2>
          <p className="mt-3 max-w-xl text-gray-400">
            Five steps, start to finish. Everything below is the real flow —
            we&apos;re just walking through it with a made-up pad so you can
            see what each screen does.{' '}
            <b className="text-white">
              Your pad keeps half of every fee it ever produces.
            </b>
          </p>
        </div>

        <div className="mt-10 space-y-14">
          {/* 01 ------------------------------------------------------- */}
          <Step
            n="01"
            title="Connect your wallet"
            text="Whatever wallet you connect becomes the owner of the pad. It's the address the payout bot sends your half to, so connect the one you actually want to get paid on."
            chip="Takes ~10 seconds"
          >
            <Mock title="Select wallet">
              <WalletRow name="Phantom" note="Detected" selected />
              <WalletRow name="Solflare" note="Detected" />
              <WalletRow name="Backpack" note="Install" />
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-accent/15 px-3 py-2 text-sm">
                <Check /> <b className="text-white">Owner wallet</b>
                <span className="font-mono text-gray-400">{OWNER}</span>
              </div>
            </Mock>
          </Step>

          {/* 02 ------------------------------------------------------- */}
          <Step
            n="02"
            title="Name it and claim the subdomain"
            text="Logo, name, one line of description. The subdomain is checked live and becomes your launchpad's public address — creators land there, not on a shared feed."
            chip={`frogpad.${ROOT_DOMAIN}`}
          >
            <Mock title="Create launchpad">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4e8c5] text-2xl">
                  🐸
                </div>
                <div className="flex-1">
                  <div className="label">Launchpad name</div>
                  <FakeInput>FrogPad</FakeInput>
                </div>
              </div>
              <div className="mt-3">
                <div className="label">Subdomain</div>
                <div className="flex items-center justify-between rounded-lg border border-accent2 bg-cream/70 px-3 py-2 text-sm">
                  <span>
                    <b className="text-white">frogpad</b>
                    <span className="text-gray-500">.{ROOT_DOMAIN}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-accent2">
                    <Check small /> available
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="label">Description</div>
                <FakeInput>Home of amphibian-grade memecoins.</FakeInput>
              </div>
            </Mock>
          </Step>

          {/* 03 ------------------------------------------------------- */}
          <Step
            n="03"
            title="Set the rules of your curve"
            text="Fee, starting market cap, graduation target and quote token. Every token launched on FrogPad inherits these settings — the fee is the dial that decides how much you earn per trade."
            chip="Higher fee = more per trade, fewer traders"
          >
            <Mock title="Curve settings">
              <CurveChart />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <StatBox label="Trading fee" value="3.5%" />
                <StatBox label="Start MC" value="$5.0k" />
                <div className="rounded-lg border border-line bg-cream/60 p-2.5">
                  <div className="label !mb-1">Quote</div>
                  <div className="flex gap-1">
                    <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-cream">
                      SOL
                    </span>
                    <span className="rounded border border-line px-2 py-0.5 text-xs text-gray-500">
                      USDC
                    </span>
                  </div>
                </div>
              </div>
            </Mock>
          </Step>

          {/* 04 ------------------------------------------------------- */}
          <Step
            n="04"
            title={`Pay ${CREATION_FEE_SOL} SOL — and watch it burn`}
            text="One transaction. The creation fee isn't a subscription and it doesn't sit in a treasury: it goes straight into buying and burning the platform token. Then FrogPad is live at its own address."
            chip="100% of the fee is burned"
          >
            <Mock title={`🔒 frogpad.${ROOT_DOMAIN}`} live>
              <Row k="Launchpad creation fee" v={`${CREATION_FEE_SOL} SOL`} />
              <Row k="Network fee" v="0.00021 SOL" />
              <div className="my-2 text-center text-accent">↓</div>
              <div className="rounded-xl border-2 border-dashed border-accent/60 p-4 text-center">
                <div className="text-lg font-black text-accent">
                  🔥 412,908 $PAD burned
                </div>
                <div className="text-xs text-gray-500">
                  bought on market · sent to a dead address
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-bold text-accent2">
                  <Check small /> Confirmed
                </span>
                <span className="font-mono text-gray-500">5Jd8...q2Xk</span>
              </div>
            </Mock>
          </Step>

          {/* 05 ------------------------------------------------------- */}
          <Step
            n="05"
            title="Get paid on every single trade"
            text={`Creators launch on FrogPad. Every buy and every sell pays the 3.5% fee to the protocol, a public bot splits it, and half lands in ${OWNER}. Buys, sells, tokens that moon, tokens that don't — all of it.`}
            chip="50% of all fees, on all volume"
          >
            <Mock title="FrogPad · your payouts" live>
              <div className="flex items-end justify-between">
                <div>
                  <div className="label">Paid to you</div>
                  <div className="text-3xl font-black text-accent">150.1 SOL</div>
                </div>
                <div className="text-right">
                  <div className="label">Tokens on pad</div>
                  <div className="text-xl font-black text-white">37</div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <PayoutRow t="$PIXEL" fee="0.841" v="+0.421 SOL" />
                <PayoutRow t="$SPUD" fee="0.564" v="+0.282 SOL" />
                <PayoutRow t="$NAPKIN" fee="0.433" v="+0.216 SOL" />
                <PayoutRow t="$RIBBIT" fee="0.255" v="+0.128 SOL" />
              </div>
            </Mock>
          </Step>
        </div>

        {/* ------------------------------------------------ CTA ----------- */}
        <div className="card mt-20 flex flex-col items-center gap-4 p-10 text-center">
          <h3 className="text-2xl font-black text-white">Ready to spin the flywheel?</h3>
          <p className="max-w-md text-sm text-gray-400">
            {CREATION_FEE_SOL} SOL to create. Half of every fee, forever. The
            creation fee burns the platform token on its way in.
          </p>
          <a href="/create" className="btn-primary px-8 py-3 text-lg">
            Create your launchpad
          </a>
        </div>
      </div>
    </main>
  );
}

/* ---------------------------------------------------------------- pieces */

function FlowCard({
  title,
  subtitle,
  chip,
  accent,
  titleAccent,
}: {
  title: string;
  subtitle: string;
  chip?: string;
  accent?: boolean;
  titleAccent?: boolean;
}) {
  return (
    <div
      className={`flex min-w-[180px] flex-col items-center justify-center rounded-2xl border ${
        accent ? 'border-accent' : 'border-line'
      } bg-cream/70 px-5 py-4 text-center`}
    >
      <div className={`font-black ${titleAccent ? 'text-accent' : 'text-white'}`}>
        {title}
      </div>
      <div className="text-xs text-gray-500">{subtitle}</div>
      {chip && (
        <span className="mt-2 rounded-full bg-accent/20 px-3 py-0.5 text-xs font-bold text-accent">
          {chip}
        </span>
      )}
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex items-center md:px-1">
      <svg
        viewBox="0 0 90 40"
        className="h-10 w-20 rotate-90 md:rotate-0"
        aria-hidden
      >
        {label && (
          <text x="38" y="12" fontSize="10" fill="#95693f" textAnchor="middle">
            {label}
          </text>
        )}
        <line x1="4" y1="24" x2="70" y2="24" stroke="#e05f10" strokeWidth="2" strokeDasharray="6 5" />
        <path d="M70 17 L84 24 L70 31 Z" fill="#3b2210" />
      </svg>
    </div>
  );
}

function Fork() {
  return (
    <div className="flex items-center md:px-1">
      <svg viewBox="0 0 110 160" className="h-14 w-24 rotate-90 md:h-40 md:w-28 md:rotate-0" aria-hidden>
        <line x1="6" y1="80" x2="50" y2="30" stroke="#95693f" strokeWidth="2" strokeDasharray="6 5" />
        <path d="M50 24 L64 28 L52 38 Z" fill="#3b2210" />
        <text x="28" y="38" fontSize="11" fill="#95693f">50%</text>
        <line x1="6" y1="80" x2="50" y2="130" stroke="#e05f10" strokeWidth="2.5" strokeDasharray="6 5" />
        <path d="M50 122 L64 130 L52 138 Z" fill="#3b2210" />
        <text x="26" y="128" fontSize="11" fontWeight="bold" fill="#e05f10">50%</text>
      </svg>
    </div>
  );
}

function Step({
  n,
  title,
  text,
  chip,
  children,
}: {
  n: string;
  title: string;
  text: string;
  chip: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-start gap-6 md:grid-cols-2 md:gap-10">
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-accent/50 font-black text-gray-400">
            {n}
          </div>
          <div className="mt-2 h-full w-0 border-l-2 border-dashed border-line" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">{text}</p>
          <span className="mt-3 inline-block rounded-full border border-line bg-panel2/70 px-3 py-1 text-xs font-bold text-gray-300">
            {chip}
          </span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Mock({
  title,
  live,
  children,
}: {
  title: string;
  live?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel/90 shadow-lg">
      <div className="flex items-center justify-between border-b border-line bg-panel2/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="ml-2 text-xs font-bold text-gray-400">{title}</span>
        </div>
        {live && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-accent2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent2" />
            Live
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function WalletRow({
  name,
  note,
  selected,
}: {
  name: string;
  note: string;
  selected?: boolean;
}) {
  return (
    <div
      className={`mb-2 flex items-center justify-between rounded-xl border px-3 py-2.5 ${
        selected ? 'border-accent' : 'border-line'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-8 w-8 rounded-lg"
          src={WALLET_ICONS[name.toLowerCase() as keyof typeof WALLET_ICONS]}
          alt=""
        />
        <div>
          <div className="text-sm font-bold text-white">{name}</div>
          <div className="text-xs text-gray-500">{note}</div>
        </div>
      </div>
      {selected && <Check />}
    </div>
  );
}

function Check({ small }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={small ? 'h-3.5 w-3.5' : 'h-5 w-5'} fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="#b3490c"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FakeInput({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-cream/70 px-3 py-2 text-sm text-white">
      {children}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-cream/60 p-2.5">
      <div className="label !mb-1">{label}</div>
      <div className="font-black text-accent">{value}</div>
    </div>
  );
}

function CurveChart() {
  return (
    <div className="rounded-xl bg-cream/50 p-3">
      <svg viewBox="0 0 400 190" className="w-full" aria-hidden>
        <defs>
          <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e05f10" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e05f10" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="30" y1="10" x2="30" y2="160" stroke="#e8c895" strokeWidth="2" />
        <line x1="30" y1="160" x2="390" y2="160" stroke="#e8c895" strokeWidth="2" />
        <path
          d="M40 150 Q 220 150 320 80 T 380 22 L380 160 L40 160 Z"
          fill="url(#curveFill)"
        />
        <path
          d="M40 150 Q 220 150 320 80 T 380 22"
          fill="none"
          stroke="#e05f10"
          strokeWidth="3.5"
        />
        <circle cx="40" cy="150" r="6" fill="#fff7e8" stroke="#e05f10" strokeWidth="3" />
        <circle cx="380" cy="22" r="6" fill="#e05f10" />
        <text x="52" y="144" fontSize="12" fontWeight="bold" fill="#7a5230">
          start $5.0k
        </text>
        <text x="282" y="16" fontSize="12" fontWeight="bold" fill="#e05f10">
          graduates $69k
        </text>
      </svg>
      <div className="text-center text-[11px] font-bold text-gray-500">
        every trade moves the price along this curve
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-gray-400">{k}</span>
      <b className="text-white">{v}</b>
    </div>
  );
}

function PayoutRow({ t, fee, v }: { t: string; fee: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-cream/50 px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-[10px] font-black text-accent">
          $
        </span>
        <b className="text-white">{t}</b>
        <span className="rounded bg-accent2/15 px-1.5 text-[10px] font-bold text-accent2">
          buy
        </span>
        <span className="text-xs text-gray-500">fee {fee}</span>
      </div>
      <b className="text-accent">{v}</b>
    </div>
  );
}
