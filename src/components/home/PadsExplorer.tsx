'use client';

// Grid de launchpads reais com filtro e busca (visual dos t-cards do mock).
import { useMemo, useState } from 'react';

export interface PadCard {
  slug: string;
  name: string;
  description: string | null;
  feePct: number;
  quoteSymbol: string;
  tokens: number;
  paidSol: number;
  owner: string;
  logoUrl: string | null;
  color: string;
  xVerified: boolean;
  xHandle: string | null;
  subUrl: string;
  subHost: string;
  createdAt: string;
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * amt)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const ARROW = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h15" /><path d="m13 6 6 6-6 6" />
  </svg>
);

export default function PadsExplorer({ pads }: { pads: PadCard[] }) {
  const [filter, setFilter] = useState<'all' | 'new' | 'top'>('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    let l = [...pads];
    if (filter === 'new')
      l.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (filter === 'top') l.sort((a, b) => b.paidSol - a.paidSol);
    const s = q.trim().toLowerCase();
    if (s)
      l = l.filter(
        (p) =>
          p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
      );
    return l;
  }, [pads, filter, q]);

  return (
    <>
      <div className="t-pads-head">
        <div>
          <span className="eyebrow"><i></i>Live now</span>
          <h2>Launchpads</h2>
          <p>
            Fresh pads (under ~1h old) may still have a wobbly subdomain while
            DNS propagates — use the pad&apos;s direct link in the meantime.
          </p>
        </div>
        <div className="t-tools">
          <div className="t-filter">
            {(
              [
                ['all', 'All'],
                ['new', 'Newest'],
                ['top', 'Top earners'],
              ] as const
            ).map(([k, label]) => (
              <span
                key={k}
                className={filter === k ? 'on' : ''}
                onClick={() => setFilter(k)}
              >
                {label}
              </span>
            ))}
          </div>
          <label className="t-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pads"
              style={{ border: 0, background: 'transparent', outline: 'none', font: 'inherit', color: 'inherit', width: 120 }}
            />
          </label>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mock" style={{ marginTop: 28, padding: '44px 20px', textAlign: 'center', fontWeight: 800, color: 'var(--muted)' }}>
          {pads.length === 0
            ? 'No launchpads yet — be the first to create one.'
            : 'No pads match your search.'}
        </div>
      ) : (
        <div className="t-grid">
          {list.map((p) => (
            <a
              key={p.slug}
              className="t-card"
              href={p.subUrl}
              style={{ ['--c1' as any]: p.color, ['--c2' as any]: shade(p.color, 0.72) }}
            >
              <div className="t-banner">
                <span className="t-chip">{p.feePct}% fee</span>
              </div>
              <div className="t-card-b">
                {p.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="t-avatar"
                    src={p.logoUrl}
                    alt=""
                    style={{ objectFit: 'cover', background: '#fff' }}
                  />
                ) : (
                  <div
                    className="t-avatar"
                    style={{ background: `linear-gradient(140deg, ${shade(p.color, 1.25)}, ${p.color})` }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3>
                  {p.name}
                  {p.xVerified && (
                    <span className="verif" style={{ display: 'inline-grid', width: 18, height: 18, marginLeft: 7, verticalAlign: -2 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
                    </span>
                  )}
                </h3>
                <div className="t-sub">{p.subHost}</div>
                <p className="t-desc">{p.description || `Launch tokens on ${p.name}'s curve.`}</p>
                <div className="t-metrics">
                  <div><div className="v">{p.tokens}</div><div className="k">Tokens</div></div>
                  <div><div className="v">{p.quoteSymbol}</div><div className="k">Quote</div></div>
                  <div><div className="v hot">{p.paidSol.toFixed(p.paidSol >= 100 ? 0 : 2)}</div><div className="k">{p.quoteSymbol} to owner</div></div>
                </div>
                <div className="t-cfoot">
                  <span>owner {p.owner.slice(0, 4)}…{p.owner.slice(-4)}</span>
                  <span
                    className="t-go"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/s/${p.slug}`;
                    }}
                  >
                    direct link {ARROW}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
