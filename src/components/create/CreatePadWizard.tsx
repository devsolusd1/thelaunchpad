'use client';

// Wizard de criacao de launchpad — port fiel do mockup create.html,
// ligado no fluxo on-chain real (Meteora DBC) + registro no servidor.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  DynamicBondingCurveClient,
  deriveDbcPoolAddress,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { buildLaunchpadCurve, validateLaunchpadCurve } from '@/lib/dbc';
import { PadSpinner } from '@/components/brand';
import {
  QUOTES,
  QuoteSymbol,
  TREASURY_WALLET,
  CREATION_FEE_SOL,
  ROOT_DOMAIN,
  MIN_INITIAL_MC_USD,
  MAX_INITIAL_MC_USD,
  MIN_MIGRATION_RATIO,
  MIN_FEE_BPS,
  MAX_FEE_BPS,
  SLUG_RE,
} from '@/lib/env';

const SWATCHES = ['#d9631c', '#c4324f', '#8a5bd6', '#4a72c4', '#2f8f74', '#79ab5c', '#2b1e13'];

const money = (n: number) =>
  n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(1)}k` : `$${n || 0}`;

type Phase =
  | 'form'
  | 'price'
  | 'sign-config'
  | 'registering'
  | 'sign-token'
  | 'confirm-token'
  | 'done';

const PHASE_LABEL: Record<Phase, string> = {
  form: '',
  price: 'Fetching quote price…',
  'sign-config': 'Confirm the pad creation in your wallet…',
  registering: 'Registering your pad…',
  'sign-token': 'Confirm the pad token launch in your wallet…',
  'confirm-token': 'Confirming the token…',
  done: 'Done! Redirecting…',
};

export default function CreatePadWizard() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);

  /* identidade */
  const [sub, setSub] = useState('');
  const [subFree, setSubFree] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [color, setColor] = useState('#d9631c');
  const [notified, setNotified] = useState(false);

  /* curva */
  const [quoteSymbol, setQuoteSymbol] = useState<QuoteSymbol>('SOL');
  const [feePct, setFeePct] = useState(3.5);
  const [mc0, setMc0] = useState(5000);
  const [mc1, setMc1] = useState(69000);

  /* pad token */
  const [tokOn, setTokOn] = useState(true);
  const [tname, setTname] = useState('');
  const [tsym, setTsym] = useState('');

  /* extras */
  const [tw, setTw] = useState('');
  const [tg, setTg] = useState('');
  const [web, setWeb] = useState('');
  const [gaId, setGaId] = useState('');

  const [phase, setPhase] = useState<Phase>('form');
  const [error, setError] = useState('');

  /* cor ao vivo no wrapper */
  useEffect(() => {
    rootRef.current?.style.setProperty('--pad', color);
  }, [color]);

  /* preview do logo */
  useEffect(() => {
    if (!logo) {
      setLogoUrl(null);
      return;
    }
    const u = URL.createObjectURL(logo);
    setLogoUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [logo]);

  /* disponibilidade do subdominio */
  useEffect(() => {
    setSubFree(null);
    if (!SLUG_RE.test(sub)) return;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/launchpads/check?slug=${sub}`);
        setSubFree(!!(await r.json()).available);
      } catch {
        setSubFree(null);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [sub]);

  const feeBps = Math.round(feePct * 100);
  const isTreasury =
    !!wallet.publicKey && wallet.publicKey.toBase58() === TREASURY_WALLET;
  const valid =
    SLUG_RE.test(sub) &&
    subFree === true &&
    name.trim().length > 0 &&
    feeBps >= MIN_FEE_BPS &&
    feeBps <= MAX_FEE_BPS &&
    mc0 >= MIN_INITIAL_MC_USD &&
    mc0 <= MAX_INITIAL_MC_USD &&
    mc1 >= mc0 * MIN_MIGRATION_RATIO &&
    (!tokOn || (tname.trim().length > 0 && /^[A-Z0-9]{1,8}$/.test(tsym))) &&
    (!gaId || /^G-[A-Z0-9]{4,16}$/.test(gaId.trim().toUpperCase()));

  const totalSol = (isTreasury ? 0 : CREATION_FEE_SOL) + 0.03 + (tokOn ? 0.025 : 0);

  const pvName = name || 'Nounspad';
  const pvSub = (sub || 'nounspad') + '.' + ROOT_DOMAIN;
  const pvDesc = desc || 'Plain objects, priced by degens.';
  const pvTok = '$' + (tsym || 'NOUNS');

  async function submit() {
    setError('');
    if (!wallet.publicKey || !wallet.connected) {
      setVisible(true);
      return;
    }
    if (!TREASURY_WALLET) {
      setError('platform treasury is not configured');
      return;
    }
    try {
      /* 1. preco do quote */
      setPhase('price');
      const quote = QUOTES[quoteSymbol];
      let quoteUsd = 1;
      if (quoteSymbol === 'SOL') {
        const r = await fetch('/api/price');
        const j = await r.json();
        if (!j.solUsd) throw new Error('could not fetch the SOL price');
        quoteUsd = j.solUsd;
      }

      /* 2. config on-chain + taxa */
      setPhase('sign-config');
      const curve = buildLaunchpadCurve({
        feeBps,
        quoteDecimals: quote.decimals,
        initialMcUsd: mc0,
        migrationMcUsd: mc1,
        quoteUsdPrice: quoteUsd,
      });
      const treasury = new PublicKey(TREASURY_WALLET);
      validateLaunchpadCurve(curve, treasury);

      const configKp = Keypair.generate();
      const client = new DynamicBondingCurveClient(connection, 'confirmed');
      const tx = await client.partner.createConfig({
        ...(curve as any),
        config: configKp.publicKey,
        feeClaimer: treasury,
        leftoverReceiver: treasury,
        quoteMint: new PublicKey(quote.mint),
        payer: wallet.publicKey,
      });
      if (!isTreasury) {
        tx.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: treasury,
            lamports: Math.round(CREATION_FEE_SOL * LAMPORTS_PER_SOL),
          })
        );
      }
      const bh = await connection.getLatestBlockhash('confirmed');
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = bh.blockhash;
      const sig = await wallet.sendTransaction(tx, connection, {
        signers: [configKp],
      });
      const conf = await connection.confirmTransaction(
        { signature: sig, ...bh },
        'confirmed'
      );
      if (conf.value.err)
        throw new Error(`transaction failed on-chain: ${JSON.stringify(conf.value.err)}`);

      /* 3. registro */
      setPhase('registering');
      let logoBase64: string | undefined;
      let logoMime: string | undefined;
      if (logo) {
        logoBase64 = await fileToBase64(logo);
        logoMime = logo.type;
      }
      const res = await fetch('/api/launchpads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: sub,
          name,
          description: desc,
          ownerWallet: wallet.publicKey.toBase58(),
          configKey: configKp.publicKey.toBase58(),
          quoteSymbol,
          feeBps,
          initialMcUsd: mc0,
          migrationMcUsd: mc1,
          logoBase64,
          logoMime,
          accentColor: color,
          gaId: gaId.trim().toUpperCase() || undefined,
          twitter: tw,
          telegram: tg,
          website: web,
          txSig: sig,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'failed to register the pad');

      /* 4. pad token (opcional, 2a assinatura) */
      if (tokOn) {
        try {
          setPhase('sign-token');
          const prep = await fetch('/api/tokens/prepare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              launchpadSlug: sub,
              name: tname,
              symbol: tsym,
              description: desc,
              imageBase64: logoBase64,
              imageMime: logoMime,
              website: web,
              twitter: tw,
              telegram: tg,
              asMain: true,
            }),
          });
          const prepJson = await prep.json();
          if (!prep.ok) throw new Error(prepJson.error || 'failed to prepare the token');

          const mintKp = Keypair.generate();
          const ptx = await client.creator.createPool({
            name: tname,
            symbol: tsym.toUpperCase(),
            uri: prepJson.uri,
            payer: wallet.publicKey,
            poolCreator: wallet.publicKey,
            config: configKp.publicKey,
            baseMint: mintKp.publicKey,
          });
          const bh2 = await connection.getLatestBlockhash('confirmed');
          ptx.feePayer = wallet.publicKey;
          ptx.recentBlockhash = bh2.blockhash;
          const sig2 = await wallet.sendTransaction(ptx, connection, {
            signers: [mintKp],
          });
          setPhase('confirm-token');
          const conf2 = await connection.confirmTransaction(
            { signature: sig2, ...bh2 },
            'confirmed'
          );
          if (conf2.value.err) throw new Error('token transaction failed');
          const pool = deriveDbcPoolAddress(
            new PublicKey(QUOTES[quoteSymbol].mint),
            mintKp.publicKey,
            configKp.publicKey
          );
          await fetch('/api/tokens/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: prepJson.id,
              mint: mintKp.publicKey.toBase58(),
              pool: pool.toBase58(),
              txSig: sig2,
              creatorWallet: wallet.publicKey.toBase58(),
            }),
          });
        } catch (e: any) {
          // pad ja existe; token pode ser lancado depois pelo dashboard
          console.error('pad token launch failed:', e?.message);
        }
      }

      setPhase('done');
      router.push(`/s/${sub}/dashboard?welcome=1`);
    } catch (e: any) {
      setError(e?.message || String(e));
      setPhase('form');
    }
  }

  const busy = phase !== 'form';

  return (
    <div ref={rootRef} style={{ ['--pad' as any]: color }}>
      <main className="wrap">
        <div className="head">
          <span className="eyebrow"><i></i>{tokOn ? 'Two signatures' : 'One transaction'}</span>
          <h1>Create your launchpad</h1>
          <p>
            You sign the on-chain config (Meteora DBC) plus the creation fee.
            From then on, every token launched on your pad runs on your curve
            — and half of every trading fee goes to your wallet.{' '}
            <a href="/#how-it-works">See the full flow →</a>
          </p>
        </div>

        <div className="cols">
          {/* ══ FORM ══ */}
          <div>
            {/* 01 identity */}
            <section className="card">
              <div className="card-h">
                <span className="bead">01</span>
                <div><h2>Identity</h2><p>How your pad looks and where it lives</p></div>
              </div>

              <div className="field">
                <label className="lb" htmlFor="sub">Subdomain</label>
                <div className="affix">
                  <input
                    className="ip"
                    id="sub"
                    placeholder="nounspad"
                    autoComplete="off"
                    spellCheck={false}
                    value={sub}
                    maxLength={32}
                    onChange={(e) =>
                      setSub(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                    }
                  />
                  <span className={`ok-flag${subFree ? ' show' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
                    available
                  </span>
                  <span className="sfx">.{ROOT_DOMAIN}</span>
                </div>
                <p className="hint">
                  {subFree === false ? (
                    <span style={{ color: 'var(--dn)' }}>Already taken — pick another one.</span>
                  ) : (
                    "Lowercase letters, numbers and dashes. This is your pad's permanent address."
                  )}
                </p>
              </div>

              <div className="field">
                <label className="lb" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  Set up your own domain
                  <span className="soon">Soon</span>
                </label>
                <div className="affix locked">
                  <span className="lockic">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="3" /><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" /></svg>
                  </span>
                  <input className="ip" placeholder="nounspad.com" disabled />
                  <button
                    className={`notify${notified ? ' done' : ''}`}
                    type="button"
                    onClick={() => setNotified(true)}
                  >
                    {notified ? "We'll ping you ✓" : 'Notify me'}
                  </button>
                </div>
                <p className="hint">
                  Point a domain you already own straight at your pad — we
                  handle the certificate and the redirect. Not live yet; for
                  now every pad runs on the subdomain above, and switching
                  later won&apos;t break existing links.
                </p>
              </div>

              <div className="field">
                <label className="lb" htmlFor="name">Name</label>
                <input className="ip" id="name" placeholder="Nounspad" autoComplete="off" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="field">
                <label className="lb" htmlFor="desc">Description <span style={{ color: 'var(--sand)' }}>· optional</span></label>
                <textarea className="ip" id="desc" placeholder="Plain objects, priced by degens." value={desc} maxLength={500} onChange={(e) => setDesc(e.target.value)} />
              </div>

              <div className="field">
                <label className="lb">Logo &amp; primary color</label>
                <div className="brandgrid">
                  <label className="drop">
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt="" />
                    ) : (
                      <span>
                        Drop image<br />or click<br />
                        <b style={{ color: 'var(--sand)' }}>max 1.5MB</b>
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      hidden
                      onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    />
                  </label>
                  <div>
                    <p className="hint" style={{ margin: '0 0 10px' }}>
                      Your color paints your pad&apos;s page — buttons, links,
                      curve and highlights. It does not affect the platform.
                    </p>
                    <div className="swatches">
                      {SWATCHES.map((c) => (
                        <span
                          key={c}
                          className={`sw${color === c ? ' on' : ''}`}
                          style={{ background: c }}
                          onClick={() => setColor(c)}
                        />
                      ))}
                      <span className={`sw custom${!SWATCHES.includes(color) ? ' on' : ''}`} title="Custom color">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 02 curve */}
            <section className="card">
              <div className="card-h">
                <span className="bead">02</span>
                <div><h2>The curve</h2><p>Applies to every token launched on your pad</p></div>
              </div>

              <div className="field">
                <label className="lb">Quote token</label>
                <div className="segm">
                  {(['SOL', 'USDC'] as QuoteSymbol[]).map((q) => (
                    <button key={q} type="button" className={quoteSymbol === q ? 'on' : ''} onClick={() => setQuoteSymbol(q)}>
                      {q}
                    </button>
                  ))}
                </div>
                <p className="hint">What people trade against. SOL is the default for memecoins; USDC keeps prices flat.</p>
              </div>

              <div className="field">
                <label className="lb">Trading fee</label>
                <div className="feehead">
                  <span className="feebig">{feePct.toFixed(1)}%</span>
                  <span className="feenote">
                    you keep <b>{(feePct * 0.4).toFixed(2)}%</b> of all volume
                    (your half, net of Meteora&apos;s 20%)
                  </span>
                </div>
                <input
                  type="range"
                  min={MIN_FEE_BPS / 100}
                  max={MAX_FEE_BPS / 100}
                  step={0.5}
                  value={feePct}
                  onChange={(e) => setFeePct(Number(e.target.value))}
                />
                <div className="ticks"><span>2% · more traders</span><span>10% · more per trade</span></div>
              </div>

              <div className="row2">
                <div className="field">
                  <label className="lb" htmlFor="mc0">Starting market cap</label>
                  <input className="ip" id="mc0" inputMode="numeric" value={mc0} onChange={(e) => setMc0(Number(e.target.value.replace(/\D/g, '')) || 0)} />
                  <p className="hint">
                    ${MIN_INITIAL_MC_USD.toLocaleString()} – ${MAX_INITIAL_MC_USD.toLocaleString()}
                  </p>
                </div>
                <div className="field">
                  <label className="lb" htmlFor="mc1">Graduation market cap</label>
                  <input className="ip" id="mc1" inputMode="numeric" value={mc1} onChange={(e) => setMc1(Number(e.target.value.replace(/\D/g, '')) || 0)} />
                  <p className="hint">At least {MIN_MIGRATION_RATIO}× the start. On graduation, LP migrates to DAMM v2 and locks.</p>
                </div>
              </div>
            </section>

            {/* 03 pad token */}
            <section className="card">
              <div className="card-h">
                <span className="bead">03</span>
                <div><h2>Your pad token</h2><p>The first token on your own curve</p></div>
                <span className="opt">Optional</span>
              </div>

              <div className={`tgl-row${tokOn ? ' on' : ''}`} onClick={() => setTokOn(!tokOn)}>
                <span className="tgl"><i></i></span>
                <span>
                  <span className="tt">Launch a token for this pad</span>
                  <span className="ts">Launched right after your pad is created (second signature)</span>
                </span>
              </div>

              <div className={`reveal${tokOn ? ' open' : ''}`}>
                <div className="row2">
                  <div className="field">
                    <label className="lb" htmlFor="tname">Token name</label>
                    <input className="ip" id="tname" placeholder="Nounspad" value={tname} maxLength={32} onChange={(e) => setTname(e.target.value)} />
                  </div>
                  <div className="field">
                    <label className="lb" htmlFor="tsym">Ticker</label>
                    <div className="affix">
                      <span className="sfx" style={{ paddingLeft: 14, color: 'var(--pad)' }}>$</span>
                      <input
                        className="ip"
                        id="tsym"
                        placeholder="NOUNS"
                        style={{ textTransform: 'uppercase' }}
                        value={tsym}
                        onChange={(e) => setTsym(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                      />
                    </div>
                  </div>
                </div>
                <div className="callout">
                  <span className="ci">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></svg>
                  </span>
                  <p>
                    Your pad token trades on your own curve — so{' '}
                    <b>you collect 50% of its fees too</b>, on top of every
                    token other people launch here.
                  </p>
                </div>
              </div>
            </section>

            {/* 04 extras */}
            <section className="card">
              <div className="card-h">
                <span className="bead">04</span>
                <div><h2>Links &amp; tracking</h2><p>Everything here can be changed later</p></div>
                <span className="opt">Optional</span>
              </div>

              <div className="field">
                <label className="lb">Social links</label>
                <div className="row3">
                  <input className="ip" placeholder="Twitter / X" value={tw} onChange={(e) => setTw(e.target.value)} />
                  <input className="ip" placeholder="Telegram" value={tg} onChange={(e) => setTg(e.target.value)} />
                  <input className="ip" placeholder="Website" value={web} onChange={(e) => setWeb(e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label className="lb" htmlFor="ga">Google Analytics</label>
                <div className="ga">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V9" /><path d="M11 20V4" /><path d="M18 20v-7" /></svg>
                  <input
                    className="ip"
                    id="ga"
                    placeholder="G-XXXXXXXXXX"
                    style={{ border: 0, background: 'transparent', padding: 0 }}
                    value={gaId}
                    onChange={(e) => setGaId(e.target.value)}
                  />
                </div>
                <p className="hint">
                  Loads gtag.js on your pad&apos;s pages so traffic lands in
                  your own GA property. Leave it empty to skip — we never
                  inject third-party scripts on your behalf.
                </p>
              </div>
            </section>

            {error && (
              <div className="callout" style={{ borderColor: 'var(--dn)', background: 'color-mix(in srgb,var(--dn) 7%,#fff)' }}>
                <p style={{ color: 'var(--dn)' }}>{error}</p>
              </div>
            )}
          </div>

          {/* ══ ASIDE / live preview ══ */}
          <aside className="side">
            <div className="side-lb"><i></i>Live preview</div>

            <div className="mock">
              <div className="mock-bar">
                <div className="dots"><i></i><i></i><i></i></div>
                <span className="urlbar">🔒 <b>{sub || 'nounspad'}</b>.{ROOT_DOMAIN}</span>
              </div>

              <div className="pv-hero">
                <div className="pv-top">
                  <div className="pv-logo">
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt="" />
                    ) : (
                      pvName.trim().charAt(0).toUpperCase()
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="pv-name">{pvName}</div>
                    <div className="pv-sub">{pvSub}</div>
                  </div>
                </div>
                <p className="pv-desc">{pvDesc}</p>
                <div className="chips">
                  <span className="chip hot">{feePct.toFixed(1)}% fee</span>
                  <span className="chip">{quoteSymbol} quote</span>
                  <span className="chip">{money(mc0)} → {money(mc1)}</span>
                </div>
              </div>

              <div className="pv-body">
                <div className="pv-curve">
                  <svg viewBox="0 0 300 96" preserveAspectRatio="none" style={{ height: 96 }}>
                    <defs>
                      <linearGradient id="pvFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--pad)" stopOpacity=".3" />
                        <stop offset="100%" stopColor="var(--pad)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M4 88 C 90 86, 160 70, 210 42 S 272 8, 296 5 L296 92 L4 92Z" fill="url(#pvFill)" />
                    <path id="pvPath" d="M4 88 C 90 86, 160 70, 210 42 S 272 8, 296 5" fill="none" stroke="var(--pad)" strokeWidth="2.6" strokeLinecap="round" />
                    <circle r="4" fill="#fff" stroke="var(--pad)" strokeWidth="2.6">
                      <animateMotion dur="3.6s" repeatCount="indefinite">
                        <mpath href="#pvPath" />
                      </animateMotion>
                    </circle>
                  </svg>
                </div>
                <div className="pv-mc">
                  <span>start {money(mc0)}</span>
                  <span>graduates {money(mc1)}</span>
                </div>

                {tokOn && (
                  <div className="pv-tok">
                    <span className="tm">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7.6" /><circle cx="12" cy="12" r="3" /></svg>
                    </span>
                    <span className="tn">{pvTok}</span>
                    <span className="tb">pad token</span>
                  </div>
                )}
              </div>
            </div>

            <div className="sum">
              <h3>What you&apos;re signing</h3>
              <div className="sline">
                <span className="k">Creation fee</span>
                <span>{isTreasury ? 'free (platform)' : `${CREATION_FEE_SOL} SOL`}</span>
              </div>
              <div className="sline"><span className="k">On-chain config rent</span><span>~0.03 SOL</span></div>
              <div className="sline"><span className="k">Pad token</span><span>{tokOn ? 'included' : 'not now'}</span></div>

              <div className="sbar"><i className="p"></i><i className="y"></i></div>
              <div className="sbl"><span>Platform 50%</span><b>You 50%</b></div>

              <div className="stot">
                <span className="k" style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)' }}>Total today</span>
                <span className="n">~{totalSol.toFixed(2)} SOL</span>
              </div>
              <p className="hint" style={{ marginTop: 10 }}>
                The {CREATION_FEE_SOL} SOL is spent buying and burning the platform token.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* ══ dock ══ */}
      <div className="dock">
        <div className="dock-in">
          <div>
            <div className="d1">
              ~{totalSol.toFixed(2)} SOL to launch{' '}
              <span style={{ color: 'var(--muted)', fontWeight: 700 }}>
                {tokOn ? `· with ${pvTok}` : '· pad only'}
              </span>
            </div>
            <div className="d2">
              {busy ? PHASE_LABEL[phase] : 'Nothing is charged until you sign in your wallet.'}
            </div>
          </div>
          <button className="btn" disabled={busy || (wallet.connected && !valid)} onClick={submit}>
            {busy && <PadSpinner size={18} />}
            {busy
              ? PHASE_LABEL[phase]
              : wallet.connected
                ? 'Create my launchpad'
                : 'Connect wallet & create'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function fileToBase64(f: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(f);
  });
}
