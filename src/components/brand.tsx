/* Marca Padcore — componentes gerados do brand kit (SVG puro).
 * Partes neutras usam currentColor (funcionam no claro e no escuro);
 * o payload/acento usa o gradiente da marca. */

const GRAD = (
  <defs>
    <linearGradient id="pcg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f2913c" />
      <stop offset="100%" stopColor="#d9631c" />
    </linearGradient>
  </defs>
);

/* barras do pad (neutro) */
const BARS = (
  <>
    <rect x="-31" y="20.5" width="62" height="11" rx="5.5" fill="currentColor" />
    <rect x="-21.5" y="2.5" width="43" height="11" rx="5.5" fill="currentColor" />
    <rect x="-12" y="-15.5" width="24" height="11" rx="5.5" fill="currentColor" />
  </>
);

/* wordmark "padcore" (tracos neutros, miolo do "o" no acento) */
const WORD = (
  <g fill="none" stroke="currentColor" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="50" r="20" />
    <path d="M0 30V92" />
    <circle cx="70" cy="50" r="20" />
    <path d="M90 30V70" />
    <circle cx="120" cy="50" r="20" />
    <path d="M140 8V70" />
    <path d="M181.5 66.4A20 20 0 1 1 181.5 33.6" />
    <circle cx="213" cy="50" r="20" />
    <circle cx="213" cy="50" r="7" fill="url(#pcg)" stroke="none" />
    <path d="M245 30V70" />
    <path d="M245 45A16 16 0 0 1 269 32" />
    <path d="M281 50H321" />
    <path d="M321.0 50.0A20 20 0 1 0 310.4 67.7" />
  </g>
);

/* Mark sozinho (barras neutras + payload gradiente) */
export function PadMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={(size * 78) / 96} height={size} viewBox="-39 -56 78 96" aria-hidden style={{ display: 'block' }}>
      {GRAD}
      {BARS}
      <circle cx="0" cy="-35" r="13" fill="url(#pcg)" />
    </svg>
  );
}

/* Lockup completo: mark + wordmark (nav e footer) */
export function PadLockup({ height = 28, title = 'Padcore' }: { height?: number; title?: string }) {
  return (
    <svg width={height * 4.27} height={height} viewBox="0 0 427 100" role="img" aria-label={title} style={{ display: 'block' }}>
      {GRAD}
      <g transform="translate(33.3,50) scale(0.88) translate(0,8.25)">
        {BARS}
        <circle cx="0" cy="-35" r="13" fill="url(#pcg)" />
      </g>
      <g transform="translate(94.1,0)">{WORD}</g>
    </svg>
  );
}

/* Wordmark sozinho (quando o mark ja aparece perto) */
export function PadWordmark({ height = 14, title = 'Padcore' }: { height?: number; title?: string }) {
  return (
    <svg width={height * 3.36} height={height} viewBox="-6 0 336 100" role="img" aria-label={title} style={{ display: 'block' }}>
      {GRAD}
      {WORD}
    </svg>
  );
}

/* Tile: quadrado gradiente com o mark em creme (badge, avatares) */
export function PadTile({ size = 30, radius = 19.2 }: { size?: number; radius?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden style={{ display: 'block', flex: 'none' }}>
      {GRAD}
      <rect width="64" height="64" rx={radius} fill="url(#pcg)" />
      <g transform="translate(32,32) scale(0.474) translate(0,8.25)">
        <rect x="-31" y="20.5" width="62" height="11" rx="5.5" fill="#fffaf1" />
        <rect x="-21.5" y="2.5" width="43" height="11" rx="5.5" fill="#fffaf1" />
        <rect x="-12" y="-15.5" width="24" height="11" rx="5.5" fill="#fffaf1" />
        <circle cx="0" cy="-35" r="13" fill="#fffaf1" />
      </g>
    </svg>
  );
}

/* Loading mark animado (barras pulsam, payload sobe) */
export function PadSpinner({ size = 24 }: { size?: number }) {
  return (
    <svg width={(size * 78) / 96} height={size} viewBox="-39 -56 78 96" aria-label="Loading" style={{ display: 'block' }}>
      {GRAD}
      <rect x="-31" y="28.8" width="62" height="11" rx="5.5" fill="currentColor" opacity=".25">
        <animate attributeName="opacity" values=".25;1;.25" dur="1.2s" begin="0s" repeatCount="indefinite" />
      </rect>
      <rect x="-21.5" y="10.8" width="43" height="11" rx="5.5" fill="currentColor" opacity=".25">
        <animate attributeName="opacity" values=".25;1;.25" dur="1.2s" begin="0.15s" repeatCount="indefinite" />
      </rect>
      <rect x="-12" y="-7.2" width="24" height="11" rx="5.5" fill="currentColor" opacity=".25">
        <animate attributeName="opacity" values=".25;1;.25" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
      </rect>
      <circle cx="0" cy="-26.8" r="13" fill="url(#pcg)">
        <animate attributeName="cy" values="-26.8;-35.8;-26.8" dur="1.2s" begin=".45s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
