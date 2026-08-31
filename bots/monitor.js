#!/usr/bin/env node
/*
 * Monitor de fees — painel ao vivo no terminal, rodando da sua maquina.
 *
 * Mostra: saldo da treasury, fees pendentes (nao clamadas) por launchpad,
 * acumulado historico (clamado / pago aos donos / parte da plataforma) e os
 * ultimos payouts. Atualiza sozinho e deixa clamar+pagar com uma tecla.
 *
 * Uso:
 *   npm run bot:monitor            painel; [c] roda o split na hora
 *   npm run bot:monitor -- --auto  painel + split automatico a cada
 *                                  BOT_INTERVAL_MINUTES (default 30)
 *
 * Sem TREASURY_SECRET_BASE58 no .env o painel abre em modo leitura
 * ([c] e --auto desabilitados). Contra o Neon: npm run bots:gen antes,
 * npm run dev:gen depois (mesmo ritual dos outros bots).
 */
const readline = require('readline');
const { PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddressSync } = require('@solana/spl-token');
const { DynamicBondingCurveClient } = require('@meteora-ag/dynamic-bonding-curve-sdk');
const L = require('./lib');
const { runRound } = require('./split-fees');
const { runRound: runBuybackRound } = require('./buyback-burn');

const AUTO = process.argv.includes('--auto');
const REFRESH_S = Math.max(15, Number(process.env.BOT_MONITOR_REFRESH_SECONDS || 60));
const INTERVAL_MIN = Math.max(1, Number(process.env.BOT_INTERVAL_MINUTES || 30));
const MIN_SOL = Number(process.env.BOT_MIN_CLAIM_SOL || 0.02);
const MIN_USDC = Number(process.env.BOT_MIN_CLAIM_USDC || 2);
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const CREATION_FEE_SOL = Number(process.env.NEXT_PUBLIC_CREATION_FEE_SOL || 1);
const PAD_MINT = (process.env.PLATFORM_TOKEN_MINT || '').trim();

// ansi
const R = '\x1b[0m';
const B = '\x1b[1m';
const DIM = '\x1b[2m';
const CY = '\x1b[36m';
const GR = '\x1b[32m';
const YE = '\x1b[33m';
const RD = '\x1b[31m';

const short = (a) => (a ? `${a.slice(0, 4)}..${a.slice(-4)}` : '—');
const ui = (raw, dec) => (Number(raw) / 10 ** dec).toFixed(6);
const hhmmss = (d = new Date()) => d.toLocaleTimeString('pt-BR', { hour12: false });

async function fetchData(ctx) {
  const { connection, client, prisma, treasuryPub } = ctx;

  const pads = await prisma.launchpad.findMany({
    include: { tokens: { where: { status: 'live' } } },
    orderBy: { createdAt: 'asc' },
  });
  const payouts = await prisma.feePayout.findMany({
    orderBy: { createdAt: 'desc' },
    include: { launchpad: { select: { slug: true } } },
  });

  // saldo da treasury
  const solBal = (await connection.getBalance(treasuryPub)) / 1e9;
  let usdcBal = null;
  if (pads.some((p) => p.quoteMint === USDC_MINT)) {
    try {
      const ata = getAssociatedTokenAddressSync(new PublicKey(USDC_MINT), treasuryPub);
      const b = await connection.getTokenAccountBalance(ata);
      usdcBal = Number(b.value.uiAmount || 0);
    } catch {
      usdcBal = 0;
    }
  }

  // fees pendentes on-chain, pad a pad
  const rows = [];
  const totalPending = { SOL: 0n, USDC: 0n };
  const errors = [];
  for (const pad of pads) {
    const isSol = pad.quoteMint === L.SOL_MINT;
    const dec = isSol ? 9 : 6;
    let pending = 0n;
    let creatorPending = 0n;
    let pools = 0;
    for (const t of pad.tokens) {
      if (!t.pool) continue;
      try {
        const m = await client.state.getPoolFeeMetrics(new PublicKey(t.pool));
        const fee = BigInt(m.current.partnerQuoteFee.toString());
        if (fee > 0n) {
          pending += fee;
          pools += 1;
        }
        creatorPending += BigInt(m.current.creatorQuoteFee.toString());
      } catch (e) {
        errors.push(`${pad.slug}/${t.symbol}: ${e.message}`.slice(0, 76));
      }
    }
    totalPending[pad.quoteSymbol] += pending;
    rows.push({
      slug: pad.slug,
      quote: pad.quoteSymbol,
      dec,
      tokens: pad.tokens.length,
      pools,
      pending,
      creatorPending,
      creatorFeePct: pad.creatorFeePct,
      min: BigInt(Math.round((isSol ? MIN_SOL : MIN_USDC) * 10 ** dec)),
    });
  }

  // historico (do banco — o que o bot ja clamou e pagou de verdade)
  const hist = { SOL: { claimed: 0n, paid: 0n }, USDC: { claimed: 0n, paid: 0n } };
  for (const p of payouts) {
    const k = p.mint === L.SOL_MINT ? 'SOL' : 'USDC';
    hist[k].claimed += BigInt(p.claimedRaw || 0);
    hist[k].paid += BigInt(p.amountRaw || 0);
  }

  // buyback & burn: pote (mesma conta do bot) + rodadas executadas
  const [payingPads, buybacks] = await Promise.all([
    prisma.launchpad.count({ where: { ownerWallet: { not: treasuryPub.toBase58() } } }),
    prisma.buyback.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);
  const creationPot = payingPads * CREATION_FEE_SOL;
  const tradingPot = Number(hist.SOL.claimed - hist.SOL.paid) / 1e9;
  const burnSpent = buybacks.reduce((s, b) => s + Number(b.spentLamports), 0) / 1e9;
  // decimals do token pra formatar o queimado (se ja existir on-chain)
  if (ctx.padDec === undefined) {
    ctx.padDec = null;
    if (PAD_MINT) {
      try {
        const s = await connection.getTokenSupply(new PublicKey(PAD_MINT));
        ctx.padDec = s.value.decimals;
      } catch { /* mint ainda nao lancado */ }
    }
  }
  const burn = {
    pot: Math.max(0, creationPot + tradingPot - burnSpent),
    creationPot,
    tradingPot,
    spent: burnSpent,
    burnedUi:
      ctx.padDec != null
        ? buybacks.reduce((s, b) => s + Number(b.burnedRaw), 0) / 10 ** ctx.padDec
        : null,
    rounds: buybacks.length,
    last: buybacks.slice(0, 3),
    dec: ctx.padDec,
  };

  return { rows, totalPending, hist, payouts: payouts.slice(0, 5), solBal, usdcBal, errors, burn };
}

function draw(ctx, data, state) {
  const { treasuryPub, readOnly } = ctx;
  const out = [];
  const line = (s = '') => out.push(s);
  const money = (raw, dec, sym) => `${ui(raw, dec)} ${sym}`;

  line();
  line(`${B}${CY} PADCORE${R}${DIM} — fee bot · treasury ${R}${short(treasuryPub.toBase58())}${readOnly ? `${YE} (somente leitura)${R}` : ''}`);
  line(`${DIM} ${'─'.repeat(74)}${R}`);

  const bal = [`${B}${data.solBal.toFixed(4)} SOL${R}`];
  if (data.usdcBal !== null) bal.push(`${B}${data.usdcBal.toFixed(2)} USDC${R}`);
  line(` Saldo da treasury: ${bal.join(' · ')}`);
  line();

  // pendentes
  line(`${B} FEES PENDENTES ${R}${DIM}(on-chain, ainda nao clamadas)${R}`);
  line(`${DIM}  ${'pad'.padEnd(16)}${'tokens'.padEnd(8)}${'pendente'.padEnd(22)}status${R}`);
  if (!data.rows.length) line(`${DIM}  nenhuma launchpad no banco${R}`);
  for (const r of data.rows) {
    let status;
    if (r.pending === 0n) status = `${DIM}—${R}`;
    else if (r.pending >= r.min) status = `${GR}pronto p/ claim${R}`;
    else status = `${YE}acumulando (min ${r.quote === 'SOL' ? MIN_SOL : MIN_USDC})${R}`;
    const extra =
      r.creatorFeePct > 0
        ? ` ${DIM}· split criador ${r.creatorFeePct}% (${ui(r.creatorPending, r.dec)} ${r.quote} p/ criadores)${R}`
        : '';
    line(
      `  ${r.slug.padEnd(16)}${String(r.tokens).padEnd(8)}${money(r.pending, r.dec, r.quote).padEnd(22)}${status}${extra}`
    );
  }
  const tp = [];
  if (data.totalPending.SOL > 0n) tp.push(money(data.totalPending.SOL, 9, 'SOL'));
  if (data.totalPending.USDC > 0n) tp.push(money(data.totalPending.USDC, 6, 'USDC'));
  line(`  ${DIM}total pendente:${R} ${B}${tp.length ? tp.join(' + ') : '0'}${R}`);
  line();

  // historico
  line(`${B} ACUMULADO ${R}${DIM}(historico do bot)${R}`);
  for (const sym of ['SOL', 'USDC']) {
    const h = data.hist[sym];
    if (h.claimed === 0n && h.paid === 0n) continue;
    const dec = sym === 'SOL' ? 9 : 6;
    line(
      `  clamado ${B}${money(h.claimed, dec, sym)}${R}  ·  pago aos donos ${GR}${money(h.paid, dec, sym)}${R}  ·  plataforma ${CY}${money(h.claimed - h.paid, dec, sym)}${R}`
    );
  }
  if (data.hist.SOL.claimed === 0n && data.hist.USDC.claimed === 0n)
    line(`${DIM}  nenhum payout registrado ainda${R}`);
  line();

  // buyback & burn
  const bb = data.burn;
  line(`${B} BUYBACK & BURN ${R}${DIM}${PAD_MINT ? `($PAD ${short(PAD_MINT)})` : '(token ainda nao definido)'}${R}`);
  line(
    `  pote ${B}${bb.pot.toFixed(4)} SOL${R} ${DIM}(criacao ${bb.creationPot.toFixed(2)} + fees ${bb.tradingPot.toFixed(4)} − queimado ${bb.spent.toFixed(4)})${R}`
  );
  if (bb.rounds > 0) {
    line(
      `  queimado ${CY}${bb.burnedUi != null ? bb.burnedUi.toLocaleString('en-US') + ' $PAD' : bb.last[0].burnedRaw + ' raw'}${R} em ${bb.rounds} rodada(s) · gasto ${bb.spent.toFixed(4)} SOL`
    );
    for (const b of bb.last) {
      const when = new Date(b.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      line(`  ${DIM}${when}  ${(Number(b.spentLamports) / 1e9).toFixed(4)} SOL · burn ${b.burnTx.slice(0, 12)}…${R}`);
    }
  } else {
    line(`${DIM}  nenhum burn executado ainda${R}`);
  }
  line();

  // ultimos payouts
  if (data.payouts.length) {
    line(`${B} ULTIMOS PAYOUTS${R}`);
    for (const p of data.payouts) {
      const dec = p.mint === L.SOL_MINT ? 9 : 6;
      const sym = p.mint === L.SOL_MINT ? 'SOL' : 'USDC';
      const when = new Date(p.createdAt).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
      });
      line(
        `  ${DIM}${when}${R}  ${(p.launchpad?.slug || '?').padEnd(14)}${money(BigInt(p.amountRaw), dec, sym).padEnd(18)}${DIM}-> ${short(p.wallet)} · ${p.txSig.slice(0, 12)}…${R}`
      );
    }
    line();
  }

  for (const e of data.errors.slice(0, 3)) line(`${RD}  !! ${e}${R}`);

  line(`${DIM} ${'─'.repeat(74)}${R}`);
  const auto = AUTO
    ? `auto ${GR}ON${R}${DIM} (split a cada ${INTERVAL_MIN} min, proximo ${hhmmss(new Date(state.nextAutoAt))})${R}`
    : `auto ${DIM}OFF (use --auto para rodar sozinho)${R}`;
  line(` ${readOnly ? `${DIM}[c]/[b] indisponiveis sem TREASURY_SECRET_BASE58${R}` : `${B}[c]${R} clamar+pagar   ${B}[b]${R} buyback+burn`}   ${B}[r]${R} atualizar   ${B}[q]${R} sair`);
  line(` ${auto}${DIM} · atualizado ${hhmmss()} · refresh a cada ${REFRESH_S}s${R}`);
  line();

  process.stdout.write('\x1b[2J\x1b[H' + out.join('\n'));
}

async function refresh(ctx, state) {
  try {
    const data = await fetchData(ctx);
    state.lastData = data;
    draw(ctx, data, state);
  } catch (e) {
    process.stdout.write('\x1b[2J\x1b[H');
    console.log(`${RD}[X] falha ao atualizar: ${e.message}${R}`);
    if (/sqlite|postgres|datasource|P10/i.test(String(e)))
      console.log(`${DIM}dica: contra o Neon rode "npm run bots:gen" antes (e "npm run dev:gen" depois)${R}`);
    console.log(`${DIM}tentando de novo em ${REFRESH_S}s · [q] sai${R}`);
  }
}

async function runSplitNow(ctx, state) {
  if (state.busy) return;
  state.busy = true;
  process.stdout.write('\x1b[2J\x1b[H');
  console.log(`${B}${CY}=== Rodando claim + split (${hhmmss()}) ===${R}\n`);
  try {
    await runRound(ctx);
    console.log(`\n${GR}rodada concluida${R}`);
  } catch (e) {
    console.log(`\n${RD}[X] rodada falhou: ${e.message}${R}`);
  }
  console.log(`${DIM}voltando ao painel em 6s…${R}`);
  await L.sleep(6000);
  state.busy = false;
  await refresh(ctx, state);
}

// [b]: uma rodada de buyback & burn — SO roda quando voce manda
async function runBuybackNow(ctx, state) {
  if (state.busy) return;
  state.busy = true;
  process.stdout.write('\x1b[2J\x1b[H');
  console.log(`${B}${CY}=== Rodando buyback & burn (${hhmmss()}) ===${R}\n`);
  try {
    if (!PAD_MINT) throw new Error('PLATFORM_TOKEN_MINT nao definido no .env');
    await runBuybackRound({
      connection: ctx.connection,
      treasury: ctx.treasury,
      prisma: ctx.prisma,
      mint: new PublicKey(PAD_MINT),
    });
    console.log(`\n${GR}rodada concluida${R}`);
  } catch (e) {
    console.log(`\n${RD}[X] rodada falhou: ${e.message}${R}`);
  }
  console.log(`${DIM}voltando ao painel em 6s…${R}`);
  await L.sleep(6000);
  state.busy = false;
  await refresh(ctx, state);
}

async function main() {
  const connection = L.makeConnection();
  const hasSecret = !!(process.env.TREASURY_SECRET_BASE58 || '').trim();
  const treasury = hasSecret
    ? L.loadTreasury()
    : { publicKey: new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET) };
  const prisma = L.makePrisma();
  const client = new DynamicBondingCurveClient(connection, 'confirmed');
  const ctx = { connection, client, treasury, prisma, treasuryPub: treasury.publicKey, readOnly: !hasSecret };
  const state = { busy: false, nextAutoAt: Date.now() + INTERVAL_MIN * 60_000 };

  if (AUTO && !hasSecret) {
    console.log(`${RD}[X] --auto precisa de TREASURY_SECRET_BASE58 no .env${R}`);
    process.exit(1);
  }

  // teclas
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.on('keypress', async (_s, key) => {
    if (!key) return;
    if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
      process.stdout.write('\x1b[2J\x1b[H');
      await prisma.$disconnect().catch(() => {});
      process.exit(0);
    }
    if (state.busy) return;
    if (key.name === 'r') await refresh(ctx, state);
    if (key.name === 'c' && !ctx.readOnly) {
      await runSplitNow(ctx, state);
      state.nextAutoAt = Date.now() + INTERVAL_MIN * 60_000;
    }
    if (key.name === 'b' && !ctx.readOnly) await runBuybackNow(ctx, state);
  });

  await refresh(ctx, state);
  for (;;) {
    await L.sleep(REFRESH_S * 1000);
    if (state.busy) continue;
    if (AUTO && Date.now() >= state.nextAutoAt) {
      await runSplitNow(ctx, state);
      state.nextAutoAt = Date.now() + INTERVAL_MIN * 60_000;
    } else {
      await refresh(ctx, state);
    }
  }
}

main().catch((e) => {
  console.error('\n[X]', e.stack || e.message);
  process.exit(1);
});
