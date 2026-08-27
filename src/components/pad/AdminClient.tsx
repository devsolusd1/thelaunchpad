'use client';

// Owner dashboard do pad — port do admin.html com dados reais.
// Edicoes (branding, links, GA, featured) sao salvas com uma assinatura de
// mensagem da wallet dona (gratis). Curva e' imutavel on-chain.
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import bs58 from 'bs58';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((m) => m.WalletMultiButton),
  { ssr: false }
);

const SWATCHES = ['#d9631c', '#c4324f', '#8a5bd6', '#4a72c4', '#2f8f74', '#79ab5c', '#2b1e13'];

export interface AdminData {
  siteName: string;
  rootDomain: string;
  slug: string;
  name: string;
  description: string | null;
  ownerWallet: string;
  feePct: number;
  quoteSymbol: string;
  initialMcUsd: number;
  migrationMcUsd: number;
  accentColor: string | null;
  gaId: string | null;
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  logoUrl: string | null;
  mainTokenMint: string | null;
  xVerified: boolean;
  xHandle: string | null;
  stats: { tokens: number; graduated: number; paid: number; unclaimed: number; lifetime: number };
  tokens: { mint: string; name: string; symbol: string; imageUrl: string | null; mcUsd: number | null; migrated: boolean }[];
  payouts: { date: string; amountUi: number; txSig: string }[];
}

const usd = (n: number | null) =>
  n === null || !isFinite(n) ? '—' : n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(1)}k` : `$${n.toFixed(0)}`;

const LOCK = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="3" /><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" />
  </svg>
);

export default function AdminClient({ data }: { data: AdminData }) {
  const wallet = useWallet();
  const router = useRouter();
  const isOwner = wallet.connected && wallet.publicKey?.toBase58() === data.ownerWallet;

  /* estado editavel */
  const [name, setName] = useState(data.name);
  const [desc, setDesc] = useState(data.description || '');
  const [color, setColor] = useState(data.accentColor || '#d9631c');
  const [tw, setTw] = useState(data.twitter || '');
  const [tg, setTg] = useState(data.telegram || '');
  const [web, setWeb] = useState(data.website || '');
  const [gaId, setGaId] = useState(data.gaId || '');
  const [featured, setFeatured] = useState(data.mainTokenMint || '');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [notified, setNotified] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.querySelector<HTMLElement>('.pg-pad')?.style.setProperty('--pad', color);
  }, [color]);

  useEffect(() => {
    if (!logo) { setLogoPreview(null); return; }
    const u = URL.createObjectURL(logo);
    setLogoPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [logo]);

  /* scrollspy */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const links = [...root.querySelectorAll('.snav a')] as HTMLAnchorElement[];
    const secs = links
      .map((a) => root.querySelector(a.getAttribute('href') || ''))
      .filter(Boolean) as Element[];
    const obs = secs.map(
      (s) =>
        new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              if (!e.isIntersecting) return;
              const i = secs.indexOf(e.target);
              links.forEach((l, k) => l.classList.toggle('on', k === i));
            }),
          { rootMargin: '-15% 0px -70% 0px' }
        )
    );
    obs.forEach((o, i) => o.observe(secs[i]));
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  function touch() { setDirty(true); setMsg(''); }

  async function save() {
    if (!wallet.publicKey || !wallet.signMessage) {
      setMsg('connect the owner wallet (with message signing) to save');
      return;
    }
    try {
      setBusy(true);
      setMsg('');
      const timestamp = Date.now();
      const sig = await wallet.signMessage(
        new TextEncoder().encode(`thelaunchpad:update:${data.slug}:${timestamp}`)
      );
      const body: Record<string, unknown> = {
        wallet: wallet.publicKey.toBase58(),
        timestamp,
        signature: bs58.encode(sig),
        name,
        description: desc,
        twitter: tw,
        telegram: tg,
        website: web,
        accentColor: color,
        gaId: gaId.trim().toUpperCase(),
        mainTokenMint: featured,
      };
      if (logo) {
        body.logoBase64 = await fileToBase64(logo);
        body.logoMime = logo.type;
      }
      const res = await fetch(`/api/launchpads/${data.slug}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'failed to save');
      setDirty(false);
      setLogo(null);
      setMsg('saved ✓');
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function verifyX() {
    if (!wallet.publicKey || !wallet.signMessage) {
      setMsg('connect the owner wallet to verify');
      return;
    }
    try {
      setBusy(true);
      const timestamp = Date.now();
      const sig = await wallet.signMessage(
        new TextEncoder().encode(`thelaunchpad:verify-x:${data.slug}:${timestamp}`)
      );
      const res = await fetch('/api/x/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: data.slug,
          wallet: wallet.publicKey.toBase58(),
          timestamp,
          signature: bs58.encode(sig),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'failed to start X verification');
      window.location.href = j.url;
    } catch (e: any) {
      setMsg(e?.message || String(e));
      setBusy(false);
    }
  }

  const featuredTok = data.tokens.find((t) => t.mint === featured);

  return (
    <div ref={rootRef} className="pg-admin">
      <div className="bgfx"></div>

      {/* topbar */}
      <nav className="nav">
        <div className="nav-in">
          <div className="padid">
            {data.logoUrl && !logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoUrl} alt="" style={{ width: 30, height: 30, borderRadius: 10, objectFit: 'cover' }} />
            ) : logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="" style={{ width: 30, height: 30, borderRadius: 10, objectFit: 'cover' }} />
            ) : (
              <span className="tile">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7.6" /><circle cx="12" cy="12" r="3" /></svg>
              </span>
            )}
            {name}
          </div>
          {isOwner ? (
            <span className="owner">{LOCK} Owner mode</span>
          ) : (
            <span className="owner" style={{ opacity: 0.6 }}>view only</span>
          )}
          <div className="right">
            <a className="btn ghost sm" href={`/s/${data.slug}`}>
              View public page
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
            </a>
            <WalletMultiButton />
          </div>
        </div>
      </nav>

      <div className="wrap">
        <div className="head">
          <span className="eyebrow"><i></i>Owner dashboard</span>
          <h1>Manage {name}</h1>
          <p>
            Branding, links and tracking update instantly. The curve lives
            on-chain and can&apos;t be edited after creation — that&apos;s
            what makes it trustworthy for the people launching here.
          </p>
        </div>

        <div className="cols">
          {/* side nav */}
          <nav className="snav">
            <a className="on" href="#overview">Overview</a>
            <a href="#fees">Fees &amp; payouts</a>
            <div className="sep"></div>
            <a href="#branding">Branding</a>
            <a href="#curve">Curve</a>
            <a href="#token">Pad token</a>
            <a href="#featured">Featured token</a>
            <div className="sep"></div>
            <a href="#domain">Domain</a>
            <a href="#analytics">Analytics</a>
            <a href="#danger" style={{ color: 'var(--dn)' }}>Danger zone</a>
          </nav>

          {/* content */}
          <div>
            {/* overview */}
            <section className="card" id="overview">
              <div className="card-h">
                <span className="hic">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></svg>
                </span>
                <div><h2>Overview</h2><p>All time</p></div>
              </div>
              <div className="stats">
                <div className="st"><div className="n">{data.stats.tokens}</div><div className="l">Tokens launched</div></div>
                <div className="st"><div className="n">{data.stats.graduated}</div><div className="l">Graduated</div></div>
                <div className="st"><div className="n">{data.stats.lifetime.toFixed(3)}</div><div className="l">{data.quoteSymbol} in lifetime fees</div></div>
                <div className="st"><div className="n hot">{data.stats.paid.toFixed(3)}</div><div className="l">{data.quoteSymbol} paid to you</div></div>
              </div>
            </section>

            {/* fees */}
            <section className="card" id="fees">
              <div className="card-h">
                <span className="hic">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16" /><path d="M17 8H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6" /></svg>
                </span>
                <div><h2>Fees &amp; payouts</h2><p>Half of every trading fee on this pad</p></div>
                <span className="pill">Automatic</span>
              </div>

              <div className="claim">
                <div>
                  <div className="k">Unclaimed in the pools</div>
                  <div className="big">{data.stats.unclaimed.toFixed(4)} {data.quoteSymbol}</div>
                </div>
                <div className="side">
                  <button className="btn" disabled title="Payouts run automatically via the public bot">
                    Paid automatically
                  </button>
                  <span className="nx">The public bot claims and pays your half on a regular schedule.</span>
                </div>
              </div>

              <div className="tbl">
                <div className="tr"><span>Date</span><span>Amount</span><span></span><span>Tx</span></div>
                {data.payouts.length === 0 ? (
                  <div className="tr"><span style={{ gridColumn: '1 / -1', color: 'var(--muted)' }}>No payouts yet — fees accrue until they pass the bot&apos;s minimum.</span></div>
                ) : (
                  data.payouts.map((p, i) => (
                    <div className="tr" key={i}>
                      <span>{new Date(p.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="amt">+{p.amountUi.toFixed(4)} {data.quoteSymbol}</span>
                      <span></span>
                      <a href={`https://solscan.io/tx/${p.txSig}`} target="_blank">
                        <code>{p.txSig.slice(0, 4)}…{p.txSig.slice(-4)}</code>
                      </a>
                    </div>
                  ))
                )}
              </div>
              <p className="hint">Payouts are executed by a public bot and are verifiable on-chain.</p>
            </section>

            {/* branding */}
            <section className="card" id="branding">
              <div className="card-h">
                <span className="hic">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5" /><circle cx="9" cy="10" r="1.2" fill="currentColor" /><circle cx="15" cy="10" r="1.2" fill="currentColor" /><path d="M9 15.5c1.8 1.4 4.2 1.4 6 0" /></svg>
                </span>
                <div><h2>Branding</h2><p>Applies to your pad&apos;s public page</p></div>
                <span className="pill">Editable anytime</span>
              </div>

              <div className="field">
                <label className="lb">Name</label>
                <input className="ip" value={name} maxLength={60} onChange={(e) => { setName(e.target.value); touch(); }} disabled={!isOwner} />
              </div>
              <div className="field">
                <label className="lb">Description</label>
                <textarea className="ip" value={desc} maxLength={500} onChange={(e) => { setDesc(e.target.value); touch(); }} disabled={!isOwner} />
              </div>

              <div className="field">
                <label className="lb">Logo &amp; primary color</label>
                <div className="brandgrid">
                  <label className="drop">
                    {logoPreview || data.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoPreview || data.logoUrl!} alt="" />
                    ) : (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--pad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M3 17l5-4 4 3 4-4 5 5" />
                      </svg>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      hidden
                      disabled={!isOwner}
                      onChange={(e) => { setLogo(e.target.files?.[0] || null); touch(); }}
                    />
                  </label>
                  <div>
                    <p className="hint" style={{ margin: '0 0 11px' }}>
                      Repaints your public page instantly — header, buttons, curve and highlights.
                    </p>
                    <div className="swatches">
                      {SWATCHES.map((c) => (
                        <span key={c} className={`sw${color === c ? ' on' : ''}`} style={{ background: c }} onClick={() => { if (isOwner) { setColor(c); touch(); } }} />
                      ))}
                      <span className={`sw custom${!SWATCHES.includes(color) ? ' on' : ''}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                        <input type="color" value={color} disabled={!isOwner} onChange={(e) => { setColor(e.target.value); touch(); }} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="lb">Social links</label>
                <div className="row3">
                  <input className="ip" placeholder="Twitter / X" value={tw} onChange={(e) => { setTw(e.target.value); touch(); }} disabled={!isOwner} />
                  <input className="ip" placeholder="Telegram" value={tg} onChange={(e) => { setTg(e.target.value); touch(); }} disabled={!isOwner} />
                  <input className="ip" placeholder="Website" value={web} onChange={(e) => { setWeb(e.target.value); touch(); }} disabled={!isOwner} />
                </div>
              </div>

              <div className="field">
                <label className="lb">X verification</label>
                {data.xVerified ? (
                  <span className="pill" style={{ color: 'var(--ok)', borderColor: 'var(--ok)', background: 'color-mix(in srgb,var(--ok) 12%,#fff)', marginLeft: 0 }}>
                    ✓ verified as @{data.xHandle}
                  </span>
                ) : (
                  <div>
                    <button className="btn ghost sm" onClick={verifyX} disabled={!isOwner || busy}>
                      Verify with X
                    </button>
                    <p className="hint">Links your X account to this pad and shows a verified badge everywhere.</p>
                  </div>
                )}
              </div>
            </section>

            {/* curve */}
            <section className="card" id="curve">
              <div className="card-h">
                <span className="hic">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V4" /><path d="M4 20h16" /><path d="M7 17c2.5 0 3.5-2.4 5-6s2.5-6 5-6" /></svg>
                </span>
                <div><h2>Curve</h2><p>Written on-chain when the pad was created</p></div>
                <span className="pill lock">Immutable</span>
              </div>
              <div className="locked">
                <div className="lk"><div className="k">{LOCK} Trading fee</div><div className="v">{data.feePct}%</div></div>
                <div className="lk"><div className="k">{LOCK} Quote token</div><div className="v">{data.quoteSymbol}</div></div>
                <div className="lk"><div className="k">{LOCK} Starting MC</div><div className="v">{usd(data.initialMcUsd)}</div></div>
                <div className="lk"><div className="k">{LOCK} Graduation MC</div><div className="v">{usd(data.migrationMcUsd)}</div></div>
              </div>
              <p className="hint">
                Nobody can change the rules under a token that already
                launched — not even you. To run different terms, create a
                second pad; one wallet can own many.
              </p>
            </section>

            {/* pad token */}
            <section className="card" id="token">
              <div className="card-h">
                <span className="hic">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7.6" /><circle cx="12" cy="12" r="3" /></svg>
                </span>
                <div><h2>Pad token</h2><p>Your own token on your own curve</p></div>
                {featuredTok ? (
                  <span className="pill" style={{ color: 'var(--ok)', borderColor: 'var(--ok)', background: 'color-mix(in srgb,var(--ok) 12%,#fff)' }}>Live</span>
                ) : (
                  <span className="pill">Not launched</span>
                )}
              </div>
              {featuredTok ? (
                <div className="nat">
                  {featuredTok.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featuredTok.imageUrl} alt="" style={{ width: 52, height: 52, borderRadius: 16, objectFit: 'cover', flex: 'none' }} />
                  ) : (
                    <span className="ic">
                      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7.6" /><circle cx="12" cy="12" r="3" /></svg>
                    </span>
                  )}
                  <div>
                    <div className="nm">{featuredTok.name}</div>
                    <div className="tk">${featuredTok.symbol} · <code>{featuredTok.mint.slice(0, 4)}…{featuredTok.mint.slice(-4)}</code></div>
                  </div>
                  <div className="mt">
                    <div><div className="k">Market cap</div><div className="v">{usd(featuredTok.mcUsd)}</div></div>
                    <div><div className="k">Status</div><div className="v">{featuredTok.migrated ? 'graduated' : 'on the curve'}</div></div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="hint" style={{ marginBottom: 12 }}>
                    Launch your pad&apos;s own token — it trades on your curve
                    and pays you the same 50%, pinned to the top of your page.
                  </p>
                  <a className="btn" href={`/s/${data.slug}/create?main=1`}>Launch pad token</a>
                </div>
              )}
            </section>

            {/* featured */}
            <section className="card" id="featured">
              <div className="card-h">
                <span className="hic">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 2.6 5.7 6.4.7-4.7 4.3 1.3 6.3L12 17l-5.6 3 1.3-6.3L3 9.4l6.4-.7L12 3Z" /></svg>
                </span>
                <div><h2>Featured token</h2><p>Pinned above the grid on your page</p></div>
              </div>
              {data.tokens.length === 0 ? (
                <p className="hint">No tokens on this pad yet.</p>
              ) : (
                <div className="plist">
                  {data.tokens.map((t) => (
                    <div
                      key={t.mint}
                      className={`pit${featured === t.mint ? ' on' : ''}`}
                      onClick={() => { if (isOwner) { setFeatured(featured === t.mint ? '' : t.mint); touch(); } }}
                    >
                      <span className="radio"></span>
                      {t.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.imageUrl} alt="" style={{ width: 30, height: 30, borderRadius: 10, objectFit: 'cover', flex: 'none' }} />
                      ) : (
                        <span className="ic" style={{ background: 'var(--pad)' }}>{t.symbol.charAt(0)}</span>
                      )}
                      <span><b>{t.name}</b><em>${t.symbol}{t.migrated ? ' · graduated' : ''}</em></span>
                      <span className="mc">{usd(t.mcUsd)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* domain */}
            <section className="card" id="domain">
              <div className="card-h">
                <span className="hic">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5S9.7 5.9 12 3.5Z" /></svg>
                </span>
                <div><h2>Domain</h2><p>Where your pad lives</p></div>
              </div>
              <div className="field">
                <label className="lb">Subdomain <span className="pill lock" style={{ margin: 0 }}>Permanent</span></label>
                <div className="affix lockd">
                  <input className="ip" value={data.slug} disabled />
                  <span className="sfx">.{data.rootDomain}</span>
                </div>
                <p className="hint">
                  Locked so existing links and shared charts never break. New
                  subdomains can take up to ~1h to resolve everywhere; the
                  direct link /s/{data.slug} always works.
                </p>
              </div>
              <div className="field">
                <label className="lb">Your own domain <span className="soon">Soon</span></label>
                <div className="affix lockd">
                  <input className="ip" placeholder={`${data.slug}.com`} disabled />
                  <button className="btn ghost sm" type="button" onClick={() => setNotified(true)} style={notified ? { borderColor: 'var(--ok)', color: 'var(--ok)' } : undefined}>
                    {notified ? "We'll ping you ✓" : 'Notify me'}
                  </button>
                </div>
                <p className="hint">
                  Point a domain you already own at this pad. We handle the
                  certificate; the subdomain keeps working as a mirror.
                </p>
              </div>
            </section>

            {/* analytics */}
            <section className="card" id="analytics">
              <div className="card-h">
                <span className="hic">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V9" /><path d="M11 20V4" /><path d="M18 20v-7" /></svg>
                </span>
                <div><h2>Analytics</h2><p>Traffic on your pad&apos;s pages</p></div>
              </div>
              <div className="field">
                <label className="lb">Google Analytics measurement ID</label>
                <input className="ip" placeholder="G-XXXXXXXXXX" value={gaId} onChange={(e) => { setGaId(e.target.value); touch(); }} disabled={!isOwner} />
                <p className="hint">
                  gtag.js loads on your pad&apos;s pages and reports into your
                  own property. Clear the field to remove it — we never inject
                  third-party scripts on your behalf. View your traffic inside
                  Google Analytics.
                </p>
              </div>
            </section>

            {/* danger */}
            <section className="card danger-card" id="danger">
              <div className="card-h">
                <span className="hic" style={{ background: 'linear-gradient(140deg,#e0798d,var(--dn))' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5 21 19H3l9-14.5Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>
                </span>
                <div><h2>Danger zone</h2><p>Coming soon — each will require a wallet signature</p></div>
              </div>
              <div className="drow">
                <div><div className="t">Change payout wallet <span className="soon">Soon</span></div>
                  <div className="d">Future fee payouts go to a different address. Past payouts stay where they landed.</div></div>
                <div className="a"><button className="btn ghost sm" disabled>Change wallet</button></div>
              </div>
              <div className="drow">
                <div><div className="t">Hide from the directory <span className="soon">Soon</span></div>
                  <div className="d">Your pad stops showing on the {data.siteName} homepage. The subdomain keeps working and tokens keep trading.</div></div>
                <div className="a"><button className="btn ghost sm" disabled>Hide pad</button></div>
              </div>
              <div className="drow">
                <div><div className="t">Transfer ownership <span className="soon">Soon</span></div>
                  <div className="d">Hands the pad, its token and all future fees to another wallet. This cannot be undone.</div></div>
                <div className="a"><button className="btn danger sm" disabled>Transfer pad</button></div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* save dock */}
      <div className={`dock${dirty ? ' show' : ''}`}>
        <div className="dock-in">
          <div>
            <div className="d1"><span className="dot"></span>{msg || 'Unsaved changes'}</div>
            <div className="d2">Saving asks your wallet for a free message signature — no transaction.</div>
          </div>
          <div className="acts">
            <button className="btn ghost" onClick={() => { setDirty(false); router.refresh(); }} disabled={busy}>
              Discard
            </button>
            <button className="btn" onClick={save} disabled={busy || !isOwner}>
              {busy ? 'Signing…' : 'Save changes'}
            </button>
          </div>
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
