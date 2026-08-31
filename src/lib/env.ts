export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Padcore';
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
// Dominio de marca mostrado em textos/mockups ilustrativos. Links reais
// continuam em ROOT_DOMAIN (que so vira padcore.io quando o DNS migrar).
export const DISPLAY_DOMAIN = 'padcore.io';

// Mint do $PAD (lancado 2026-08-31, supply 1B/6dec, mint authority revogada).
// A env NEXT_PUBLIC_PAD_MINT sobrepoe se for um base58 valido; placeholder
// invalido (ex: "xxxx") cai no oficial.
const OFFICIAL_PAD_MINT = '2QChDZRA76jXfmMt6t1GC6SjsmUkpiD6jzimy4jHKPAD';
const rawPadMint = (process.env.NEXT_PUBLIC_PAD_MINT || '').trim();
export const PAD_MINT = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(rawPadMint)
  ? rawPadMint
  : OFFICIAL_PAD_MINT;
export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com';
export const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || '';
export const CREATION_FEE_SOL = Number(
  process.env.NEXT_PUBLIC_CREATION_FEE_SOL || '1'
);

export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export const QUOTES = {
  SOL: { mint: SOL_MINT, symbol: 'SOL', decimals: 9 },
  USDC: { mint: USDC_MINT, symbol: 'USDC', decimals: 6 },
} as const;
export type QuoteSymbol = keyof typeof QUOTES;

// Limites do produto (decididos com o dono da plataforma)
export const MIN_INITIAL_MC_USD = 1_000;
export const MAX_INITIAL_MC_USD = 20_000;
export const MIN_MIGRATION_RATIO = 1.5; // MC final >= 1.5x o inicial
export const MIN_FEE_BPS = 200; // 2%
export const MAX_FEE_BPS = 1000; // 10%
export const TOKEN_SUPPLY = 1_000_000_000;
export const TOKEN_DECIMALS = 9;

export const RESERVED_SLUGS = [
  'www', 'api', 'app', 'admin', 'mail', 'docs', 'blog', 'static', 'cdn',
  'assets', 'help', 'support', 'status', 'dev', 'staging', 'test',
];

export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,30})[a-z0-9]$/;

export function launchpadUrl(slug: string) {
  const proto = ROOT_DOMAIN.includes('localhost') ? 'http' : 'https';
  return `${proto}://${slug}.${ROOT_DOMAIN}`;
}

// Link permanente da pagina do token — vai fixo no campo `website` do
// metadata JSON de todo token criado. Usa o dominio raiz (www), nao o
// subdominio do pad: subdominios recem-criados podem demorar a propagar.
export function tokenPageUrl(slug: string, mint: string) {
  if (ROOT_DOMAIN.includes('localhost'))
    return `http://${ROOT_DOMAIN}/s/${slug}/token/${mint}`;
  return `https://www.${ROOT_DOMAIN}/s/${slug}/token/${mint}`;
}
