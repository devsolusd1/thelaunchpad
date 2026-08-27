'use client';

// Grid de tokens de um pad com filtro/busca (visual do pad.html, dados reais).
import { useMemo, useState } from 'react';

export interface TokRow {
  mint: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
  description: string | null;
  mcUsd: number | null;
  progress: number | null;
  migrated: boolean;
  isMain: boolean;
}

function usd(n: number | null) {
  if (n === null || !isFinite(n)) return '—';
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}

export default function PadTokens({ tokens, slug }: { tokens: TokRow[]; slug: string }) {
  const [filter, setFilter] = useState<'all' | 'live' | 'grad'>('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    let l = tokens;
    if (filter === 'live') l = l.filter((t) => !t.migrated);
    if (filter === 'grad') l = l.filter((t) => t.migrated);
    const s = q.trim().toLowerCase();
    if (s)
      l = l.filter(
        (t) =>
          t.name.toLowerCase().includes(s) ||
          t.symbol.toLowerCase().includes(s) ||
          t.mint.toLowerCase().startsWith(s)
      );
    return l;
  }, [tokens, filter, q]);

  return (
    <>
      <div className="section-h">
        <div>
          <span className="eyebrow"><i></i>Launched here</span>
          <h2>Tokens ({tokens.length})</h2>
        </div>
        <div className="tools">
          <div className="filter">
            {(
              [
                ['all', 'All'],
                ['live', 'Live'],
                ['grad', 'Graduated'],
              ] as const
            ).map(([k, label]) => (
              <span key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>
                {label}
              </span>
            ))}
          </div>
          <label className="search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tokens"
              style={{ border: 0, background: 'transparent', outline: 'none', font: 'inherit', color: 'inherit', width: 110 }}
            />
          </label>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="chart" style={{ marginTop: 22, textAlign: 'center', padding: '40px 18px', fontWeight: 800, color: 'var(--muted)' }}>
          {tokens.length === 0
            ? 'No tokens yet. Be the first to launch here.'
            : 'No tokens match.'}
        </div>
      ) : (
        <div className="grid">
          {list.map((t) => (
            <a key={t.mint} className="tok" href={`/s/${slug}/token/${t.mint}`} style={{ ['--tc' as any]: 'var(--pad)' }}>
              <div className="tok-h">
                {t.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.imageUrl} alt="" style={{ width: 34, height: 34, borderRadius: 11, objectFit: 'cover', flex: 'none' }} />
                ) : (
                  <span className="tok-ic">{t.symbol.charAt(0)}</span>
                )}
                <span className="tok-nm">
                  <b>{t.name}</b>
                  <em>${t.symbol}{t.isMain ? ' · pad token' : ''}</em>
                </span>
                {t.migrated ? (
                  <span className="chg grad">graduated</span>
                ) : (
                  <span className="chg up">live</span>
                )}
              </div>
              <div className="tok-mc">
                <span className="k">Market cap</span>
                <span className="v">{usd(t.mcUsd)}</span>
              </div>
              {t.progress !== null && (
                <div className="pbar">
                  <i style={{ width: `${Math.round(t.progress * 100)}%` }}></i>
                </div>
              )}
              <div className="tok-f">
                {t.migrated ? (
                  <span className="pct grad">LP locked · DAMM v2</span>
                ) : (
                  <span className="pct">
                    {t.progress !== null ? `${Math.round(t.progress * 100)}% to graduation` : 'on the curve'}
                  </span>
                )}
                <code>{t.mint.slice(0, 4)}…{t.mint.slice(-4)}</code>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
