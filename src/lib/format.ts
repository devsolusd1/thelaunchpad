export function fmtUsd(n: number) {
  if (!isFinite(n)) return '-';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
}

export function fmtAmount(n: number, maxFrac = 4) {
  if (!isFinite(n)) return '-';
  return n.toLocaleString('en-US', { maximumFractionDigits: maxFrac });
}

export function shortAddr(a?: string | null, n = 4) {
  if (!a) return '';
  return `${a.slice(0, n)}...${a.slice(-n)}`;
}

export function fmtPct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}
