import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import PadNav from '@/components/pad/PadNav';
import PadTokens, { TokRow } from '@/components/pad/PadTokens';
import { curveStats, fmtUsdShort } from '@/lib/padstats';
import { fmtUsd, shortAddr } from '@/lib/format';
import { SITE_NAME, ROOT_DOMAIN, SOL_MINT } from '@/lib/env';

export const revalidate = 0;

const CHECK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export default async function PadHome({
  params,
}: {
  params: { site: string };
}) {
  const pad = await prisma.launchpad.findUnique({
    where: { slug: params.site.toLowerCase() },
    include: {
      tokens: { where: { status: 'live' }, orderBy: { createdAt: 'desc' } },
      payouts: { select: { amountRaw: true } },
    },
  });
  if (!pad) notFound();

  const siteProto = ROOT_DOMAIN.includes('localhost') ? 'http' : 'https';
  const siteUrl = `${siteProto}://${ROOT_DOMAIN}`;
  const logoUrl = pad.logoId ? `/api/img/${pad.logoId}` : null;

  const stats = await curveStats(
    pad.tokens.map((t) => t.pool!).filter(Boolean),
    pad.quoteSymbol
  );
  const graduated = pad.tokens.filter(
    (t) => t.pool && stats.get(t.pool)?.migrated
  ).length;
  const paidDec = pad.quoteMint === SOL_MINT ? 1e9 : 1e6;
  const paidToOwner =
    pad.payouts.reduce((s, p) => s + Number(p.amountRaw), 0) / paidDec;

  const main = pad.mainTokenMint
    ? pad.tokens.find((t) => t.mint === pad.mainTokenMint)
    : null;
  const mainStat = main?.pool ? stats.get(main.pool) : undefined;

  const rows: TokRow[] = pad.tokens.map((t) => ({
    mint: t.mint!,
    name: t.name,
    symbol: t.symbol,
    imageUrl: t.imageId ? `/api/img/${t.imageId}` : null,
    description: t.description,
    mcUsd: t.pool ? (stats.get(t.pool)?.mcUsd ?? null) : null,
    progress: t.pool ? (stats.get(t.pool)?.progress ?? null) : null,
    migrated: !!(t.pool && stats.get(t.pool)?.migrated),
    isMain: t.mint === pad.mainTokenMint,
  }));

  const since = pad.createdAt.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <div className="bgfx"></div>
      <PadNav
        siteName={SITE_NAME}
        siteUrl={siteUrl}
        slug={pad.slug}
        padName={pad.name}
        logoUrl={logoUrl}
        ownerWallet={pad.ownerWallet}
      />

      <div className="wrap">
        <div className="cover"><div className="glare"></div></div>

        <div className="hero">
          <div className="padlogo">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontFamily: 'var(--display)', fontSize: 44, fontWeight: 800, color: 'var(--pad)' }}>
                {pad.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="hero-txt">
            <div className="hname">
              <h1>{pad.name}</h1>
              {pad.xVerified && (
                <>
                  <span className="verif">{CHECK}</span>
                  {pad.xHandle && (
                    <a className="handle" href={`https://x.com/${pad.xHandle}`} target="_blank">
                      {CHECK}@{pad.xHandle}
                    </a>
                  )}
                </>
              )}
            </div>
            {pad.description && <p>{pad.description}</p>}
            <div className="hchips">
              <span className="chip hot">{pad.feeBps / 100}% fee</span>
              <span className="chip">{pad.quoteSymbol} quote</span>
              <span className="chip">
                {fmtUsd(pad.initialMcUsd)} → {fmtUsd(pad.migrationMcUsd)}
              </span>
              <span className="chip">owner <code>{shortAddr(pad.ownerWallet)}</code></span>
              <span className="chip">since {since}</span>
              {pad.twitter && <a className="chip" href={pad.twitter} target="_blank" style={{ textDecoration: 'none' }}>Twitter</a>}
              {pad.telegram && <a className="chip" href={pad.telegram} target="_blank" style={{ textDecoration: 'none' }}>Telegram</a>}
              {pad.website && <a className="chip" href={pad.website} target="_blank" style={{ textDecoration: 'none' }}>Website</a>}
            </div>
          </div>

          <div className="hero-cta">
            <a className="btn" href={`/s/${pad.slug}/create`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              Launch token
            </a>
            <a className="btn ghost" href={`/s/${pad.slug}/dashboard`}>
              Fees dashboard
            </a>
          </div>
        </div>

        <div className="strip">
          <div><div className="n">{pad.tokens.length}</div><div className="l">Tokens launched</div></div>
          <div><div className="n">{graduated}</div><div className="l">Graduated</div></div>
          <div><div className="n">{pad.feeBps / 100}%</div><div className="l">Trading fee</div></div>
          <div>
            <div className="n hot">
              {paidToOwner.toFixed(paidToOwner >= 100 ? 1 : 3)} {pad.quoteSymbol}
            </div>
            <div className="l">Fees paid to owner</div>
          </div>
        </div>

        {/* ══ pad token ══ */}
        {main && main.mint && (
          <>
            <div className="section-h">
              <div>
                <span className="eyebrow"><i></i>Pad token</span>
                <h2>The house token</h2>
              </div>
            </div>

            <div className="native">
              <div className="native-in">
                <div>
                  <span className="nat-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 2.6 5.7 6.4.7-4.7 4.3 1.3 6.3L12 17l-5.6 3 1.3-6.3L3 9.4l6.4-.7L12 3Z" /></svg>
                    Native token of this pad
                  </span>
                  <div className="nat-top">
                    {main.imageId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/api/img/${main.imageId}`} alt="" style={{ width: 58, height: 58, borderRadius: 18, objectFit: 'cover', flex: 'none' }} />
                    ) : (
                      <span className="nat-ic">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7.6" /><circle cx="12" cy="12" r="3" /></svg>
                      </span>
                    )}
                    <div>
                      <div className="nat-name">{main.name}</div>
                      <div className="nat-tk">${main.symbol}</div>
                    </div>
                  </div>

                  <div className="nat-grid">
                    <div className="nat-cell">
                      <div className="k">Market cap</div>
                      <div className="v">{fmtUsdShort(mainStat?.mcUsd ?? null)}</div>
                    </div>
                    <div className="nat-cell">
                      <div className="k">To graduation</div>
                      <div className="v">
                        {mainStat?.migrated
                          ? 'graduated'
                          : mainStat?.progress != null
                            ? `${Math.round(mainStat.progress * 100)}%`
                            : '—'}
                      </div>
                    </div>
                    <div className="nat-cell">
                      <div className="k">Trading fee</div>
                      <div className="v">{pad.feeBps / 100}%</div>
                    </div>
                  </div>

                  {mainStat?.progress != null && !mainStat.migrated && (
                    <div className="nat-prog">
                      <div className="lab">
                        <span>Bonding curve</span>
                        <span><b>{Math.round(mainStat.progress * 100)}%</b> to graduation</span>
                      </div>
                      <div className="pbar"><i style={{ width: `${Math.round(mainStat.progress * 100)}%` }}></i></div>
                      <div className="lab" style={{ marginTop: 7, fontWeight: 800, color: 'var(--sand)' }}>
                        <span>{fmtUsd(pad.initialMcUsd)} start</span>
                        <span>{fmtUsd(pad.migrationMcUsd)} → DAMM v2</span>
                      </div>
                    </div>
                  )}

                  <div className="nat-cta">
                    <a className="btn" href={`/s/${pad.slug}/token/${main.mint}`}>Buy ${main.symbol}</a>
                    <a className="btn ghost" href={`https://solscan.io/token/${main.mint}`} target="_blank">
                      <code style={{ fontSize: 11 }}>{shortAddr(main.mint)}</code>
                    </a>
                  </div>
                </div>

                <div className="chart">
                  <div className="chart-h">
                    <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                      Price
                    </span>
                  </div>
                  <iframe
                    src={`https://www.gmgn.cc/kline/sol/${main.mint}?theme=light`}
                    style={{ width: '100%', height: 240, border: 0, borderRadius: 12 }}
                    title="chart"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ tokens ══ */}
        <PadTokens tokens={rows} slug={pad.slug} />
      </div>

      <footer className="foot wm">
        <div className="wm-text" aria-hidden="true">{SITE_NAME.toUpperCase()}</div>
        <div className="foot-in">
          <span>
            {pad.name} runs on <a href={siteUrl}>{SITE_NAME}</a> · Meteora DBC ·
            LP locks on graduation
          </span>
          <span>{pad.feeBps / 100}% fee · half to the pad owner</span>
        </div>
      </footer>
    </>
  );
}
