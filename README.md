# Padcore (padcore.io) — a launchpad de launchpads (Solana / Meteora DBC)

Qualquer um cria a propria launchpad num subdominio (`prosperity.seudominio.com`),
define fee (2–10%), MC inicial ($1k–20k), MC de graduacao (livre) e quote
(SOL ou USDC). Cada token lancado dentro usa a config DBC da launchpad.
As fees de trade vao 100% pro `feeClaimer` (treasury da plataforma) e um bot
paga **metade pra wallet dona da launchpad**, com historico publico.
A taxa de criacao (0.5 SOL) alimenta **buyback & burn** do token da plataforma.

## Rodar em dev

```bash
npm install
npx prisma db push
npm run dev
```

- Site principal: http://localhost:3000
- Subdominios em dev: http://SLUG.localhost:3000 (funciona nativo no Chrome)

## Configuracao (.env)

| Var | O que e |
| --- | --- |
| `DATABASE_URL` | SQLite em dev; Postgres em producao |
| `NEXT_PUBLIC_ROOT_DOMAIN` | dominio raiz sem protocolo (ex: `thelaunchpad.fun`) |
| `NEXT_PUBLIC_RPC_URL` | RPC mainnet (Helius etc — em producao use key restrita por dominio, ela fica publica) |
| `NEXT_PUBLIC_TREASURY_WALLET` | wallet que recebe taxa de criacao + fees de partner |
| `NEXT_PUBLIC_CREATION_FEE_SOL` | taxa anti-flood de criacao de launchpad (0.5) |
| `TREASURY_SECRET_BASE58` | **so pros bots**, nunca exposta no site |
| `PLATFORM_TOKEN_MINT` | token da plataforma (buyback & burn) |

## Bots (rodar na sua maquina ou VPS, com o mesmo .env)

```bash
npm run bot:monitor                  # painel ao vivo: saldo, fees pendentes, payouts ([c] clama na hora)
npm run bot:monitor -- --auto        # painel + claim/split automatico a cada 30min
node bots/split-fees.js --dry-run    # simula
node bots/split-fees.js --loop       # clama fees e paga 50% aos donos, a cada 30min (sem painel)
node bots/buyback-burn.js --loop     # compra e queima o token da plataforma
```

Contra o banco de producao (Neon): `npm run bots:gen` antes de rodar,
`npm run dev:gen` depois pra voltar o client do dev local.

Fees do token principal ($PAD): com `PLATFORM_TOKEN_MINT` e
`BOT_PAD_FEES_WALLET` no .env, o split-fees manda 100% do clamado do pool
do $PAD pra wallet de guarda — sem split e sem entrar no pote de burn.

## Deploy em producao (Vercel)

1. Importe o repo na Vercel. O build usa `vercel-build`, que aplica o schema
   Postgres (`prisma/schema.postgres.prisma`) automaticamente.
2. Adicione um Postgres (Storage -> Neon na propria Vercel) — isso cria a
   `DATABASE_URL` sozinha. Configure as demais env vars do `.env.example`.
3. Compre o dominio, adicione `dominio.com` E `*.dominio.com` no projeto
   (wildcard exige usar os nameservers da Vercel). Sem dominio proprio, o
   site principal funciona em `projeto.vercel.app`, mas os subdominios das
   launchpads NAO (vercel.app nao aceita wildcard).
4. Ajuste `NEXT_PUBLIC_ROOT_DOMAIN` pro dominio final e redeploy.
5. Bots rodam fora da Vercel (seu PC/VPS) com o mesmo `.env` + a
   `DATABASE_URL` do Postgres e a `TREASURY_SECRET_BASE58`.

## Decisoes on-chain (nao mudar sem entender)

- `feeClaimer` e `leftoverReceiver` = treasury; `creatorTradingFeePercentage = 0`
  → 100% da fee (menos os 20% da Meteora) e clamavel pela treasury; o split
  50/50 com o dono da launchpad e feito pelo bot (off-chain, auditavel no site).
- LP pos-graduacao: 100% permanently locked em nome do partner (treasury);
  fees do pool DAMM v2 migrado tambem sao da treasury (claim via cp-amm-sdk —
  ainda nao automatizado no bot).
- Supply fixo 1B, 9 decimais, mint/freeze authority revogadas (Immutable).
- `buildCurveWithMarketCap` recebe MC **na unidade do quote** (licao do bagz):
  pra SOL convertemos USD→SOL com o preco spot da Jupiter na hora da criacao.
- Registro no servidor sempre verifica on-chain: config existe, feeClaimer
  correto, fee/quote batem, e a tx pagou a taxa de criacao pro treasury.
