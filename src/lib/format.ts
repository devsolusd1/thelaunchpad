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

// clareia/escurece um hex (#rrggbb); amt 1 = igual, >1 clareia, <1 escurece
export function shadeHex(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * amt)));
  const r = f(n >> 16);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
