#!/usr/bin/env node
/*
 * Buyback & burn do token da plataforma.
 *
 * Pote = (n. de launchpads criadas * taxa de criacao) - ja gasto em buybacks.
 * Quando o pote passa do minimo: compra PLATFORM_TOKEN_MINT via Jupiter e
 * queima 100% do que comprou. Registra tudo no banco (aparece na home).
 *
 * Uso:
 *   node bots/buyback-burn.js --dry-run
 *   node bots/buyback-burn.js
 *   node bots/buyback-burn.js --loop
 */
const { PublicKey, Transaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const {
  getAssociatedTokenAddressSync,
  createBurnInstruction,
} = require('@solana/spl-token');
const { PrismaClient } = require('@prisma/client');
const L = require('./lib');

const DRY_RUN = process.argv.includes('--dry-run');
const LOOP = process.argv.includes('--loop');
const { log, fail } = L;

const CREATION_FEE_SOL = Number(process.env.NEXT_PUBLIC_CREATION_FEE_SOL || 0.5);
const MIN_POT_SOL = Number(process.env.BOT_MIN_BUYBACK_SOL || 0.1);

async function runRound({ connection, treasury, prisma, mint }) {
  const [padCount, buybacks] = await Promise.all([
    prisma.launchpad.count(),
    prisma.buyback.findMany(),
  ]);
  const collected = BigInt(Math.round(padCount * CREATION_FEE_SOL * LAMPORTS_PER_SOL));
  const spent = buybacks.reduce((s, b) => s + BigInt(b.spentLamports), 0n);
  const pot = collected > spent ? collected - spent : 0n;
  log(
    `> ${padCount} launchpad(s) | arrecadado ${Number(collected) / 1e9} SOL | ja queimado ${Number(spent) / 1e9} SOL | pote ${Number(pot) / 1e9} SOL`
  );

  if (pot < BigInt(Math.round(MIN_POT_SOL * LAMPORTS_PER_SOL))) {
    log(`  pote abaixo do minimo (${MIN_POT_SOL} SOL), nada a fazer`);
    return;
  }

  const balance = await connection.getBalance(treasury.publicKey);
  const spendable = BigInt(Math.max(0, balance - 0.05 * LAMPORTS_PER_SOL));
  const budget = pot < spendable ? pot : spendable;
  if (budget <= 0n) {
    log('  treasury sem saldo suficiente, pulando');
    return;
  }

  const quote = await L.jupQuote({
    inputMint: L.SOL_MINT,
    outputMint: mint.toBase58(),
    amount: budget.toString(),
    slippageBps: 300,
  });
  log(
    `> Buyback: ${Number(budget) / 1e9} SOL -> ~${quote.outAmount} raw do token (impacto ${(Number(quote.priceImpactPct) * 100).toFixed(2)}%)`
  );
  if (DRY_RUN) {
    log('  (dry-run) nao vou comprar nem queimar');
    return;
  }

  const ata = getAssociatedTokenAddressSync(mint, treasury.publicKey);
  const before = await connection
    .getTokenAccountBalance(ata)
    .then((b) => BigInt(b.value.amount))
    .catch(() => 0n);
  const swapSig = await L.jupSwap({ connection, wallet: treasury, quote });
  const after = await connection
    .getTokenAccountBalance(ata)
    .then((b) => BigInt(b.value.amount))
    .catch(() => 0n);
  const bought = after - before;
  if (bought <= 0n) fail('swap nao creditou tokens');

  const burnTx = new Transaction().add(
    createBurnInstruction(ata, mint, treasury.publicKey, bought)
  );
  const burnSig = await L.sendTx(connection, burnTx, [treasury], 'burn');

  await prisma.buyback.create({
    data: {
      spentLamports: budget.toString(),
      tokenMint: mint.toBase58(),
      boughtRaw: bought.toString(),
      burnedRaw: bought.toString(),
      swapTx: swapSig,
      burnTx: burnSig,
    },
  });
  log(`> Queimado ${bought} raw do token da plataforma 🔥`);
}

async function main() {
  log(`\n=== Buyback & Burn ${DRY_RUN ? '(dry-run)' : ''} ===\n`);
  const mintStr = process.env.PLATFORM_TOKEN_MINT;
  if (!mintStr)
    fail('PLATFORM_TOKEN_MINT nao definido no .env — lance o token da plataforma primeiro');
  const mint = new PublicKey(mintStr);
  const connection = L.makeConnection();
  const treasury = L.loadTreasury();
  const prisma = new PrismaClient();
  log(`Treasury: ${treasury.publicKey.toBase58()}`);
  log(`Token:    ${mint.toBase58()}`);

  if (LOOP) {
    const interval = Math.max(1, Number(process.env.BOT_INTERVAL_MINUTES || 30)) * 60_000;
    log(`Loop a cada ${interval / 60000} min. Ctrl+C para parar.\n`);
    for (;;) {
      try {
        await runRound({ connection, treasury, prisma, mint });
      } catch (e) {
        console.error('[X] rodada falhou:', e.message);
      }
      await L.sleep(interval);
    }
  } else {
    await runRound({ connection, treasury, prisma, mint });
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('\n[X]', e.stack || e.message);
  process.exit(1);
});
