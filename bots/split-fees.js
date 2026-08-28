#!/usr/bin/env node
/*
 * Split de fees 50/50 — roda com a wallet TREASURY (feeClaimer de todos os
 * configs criados pela plataforma).
 *
 * Uma rodada, por launchpad:
 *   1. soma as fees de partner nao clamadas de todos os pools (DBC)
 *   2. clama pool a pool (chega SOL ou USDC na treasury)
 *   3. paga 50% do total clamado pra wallet dona da launchpad
 *   4. registra o pagamento no banco (aparece no /dashboard da launchpad)
 *
 * Uso:
 *   node bots/split-fees.js --dry-run
 *   node bots/split-fees.js
 *   node bots/split-fees.js --loop     (a cada BOT_INTERVAL_MINUTES, default 30)
 *
 * Pools que ja migraram pra DAMM v2 param de gerar fee aqui; as fees do pool
 * migrado (LP travado do partner) precisam do cp-amm-sdk — proximo passo.
 */
const {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');
const {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
} = require('@solana/spl-token');
const BN = require('bn.js');
const {
  DynamicBondingCurveClient,
  U64_MAX,
} = require('@meteora-ag/dynamic-bonding-curve-sdk');
const L = require('./lib');

const DRY_RUN = process.argv.includes('--dry-run');
const LOOP = process.argv.includes('--loop');
const { log, warn } = L;

// minimo clamado (por launchpad) pra valer a pena pagar
const MIN_SOL = Number(process.env.BOT_MIN_CLAIM_SOL || 0.02);
const MIN_USDC = Number(process.env.BOT_MIN_CLAIM_USDC || 2);

async function runRound({ connection, client, treasury, prisma }) {
  const pads = await prisma.launchpad.findMany({
    include: { tokens: { where: { status: 'live' } } },
  });
  log(`> ${pads.length} launchpad(s) no banco`);

  for (const pad of pads) {
    const isSol = pad.quoteMint === L.SOL_MINT;
    const dec = isSol ? 9 : 6;
    const min = BigInt(Math.round((isSol ? MIN_SOL : MIN_USDC) * 10 ** dec));

    // 1. levantar fees nao clamadas
    let pending = [];
    let totalPending = 0n;
    for (const t of pad.tokens) {
      if (!t.pool) continue;
      try {
        const m = await client.state.getPoolFeeMetrics(new PublicKey(t.pool));
        const fee = BigInt(m.current.partnerQuoteFee.toString());
        if (fee > 0n) {
          pending.push({ pool: t.pool, fee });
          totalPending += fee;
        }
      } catch (e) {
        warn(`${pad.slug}/${t.symbol}: ${e.message}`);
      }
    }

    const ui = (v) => (Number(v) / 10 ** dec).toFixed(6);
    log(
      `> ${pad.slug}: ${pending.length} pool(s) com fee, total ${ui(totalPending)} ${pad.quoteSymbol}`
    );
    if (totalPending < min) {
      if (totalPending > 0n) log(`  abaixo do minimo (${isSol ? MIN_SOL : MIN_USDC}), acumulando`);
      continue;
    }
    if (DRY_RUN) {
      log(`  (dry-run) pagaria ${ui(totalPending / 2n)} ${pad.quoteSymbol} para ${pad.ownerWallet}`);
      continue;
    }

    // 2. clamar pool a pool
    let claimed = 0n;
    for (const p of pending) {
      try {
        const tx = await client.partner.claimPartnerTradingFee({
          feeClaimer: treasury.publicKey,
          payer: treasury.publicKey,
          pool: new PublicKey(p.pool),
          maxBaseAmount: new BN(0),
          maxQuoteAmount: U64_MAX,
        });
        await L.sendTx(connection, tx, [treasury], `claim ${p.pool.slice(0, 8)}`);
        claimed += p.fee;
      } catch (e) {
        warn(`claim falhou (${p.pool.slice(0, 8)}): ${e.message}`);
      }
    }
    if (claimed === 0n) continue;

    // 3. pagar a parte do dono. Sem split de criador: dono = 1/2 do clamado.
    // Com split (creatorFeePct=25): o criador ja recebeu 25% do liquido
    // on-chain, o partner clama 75% -> dono = 25/75 = 1/3 do clamado.
    const ownerShare =
      pad.creatorFeePct === 25 ? claimed / 3n : claimed / 2n;
    const owner = new PublicKey(pad.ownerWallet);
    let paySig;
    try {
      if (isSol) {
        const tx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: treasury.publicKey,
            toPubkey: owner,
            lamports: Number(ownerShare),
          })
        );
        paySig = await L.sendTx(connection, tx, [treasury], `payout ${pad.slug}`);
      } else {
        const mintPk = new PublicKey(pad.quoteMint);
        const src = getAssociatedTokenAddressSync(mintPk, treasury.publicKey);
        const dst = getAssociatedTokenAddressSync(mintPk, owner, true);
        const tx = new Transaction().add(
          createAssociatedTokenAccountIdempotentInstruction(
            treasury.publicKey,
            dst,
            owner,
            mintPk
          ),
          createTransferInstruction(src, dst, treasury.publicKey, ownerShare)
        );
        paySig = await L.sendTx(connection, tx, [treasury], `payout ${pad.slug}`);
      }
    } catch (e) {
      warn(`payout falhou (${pad.slug}): ${e.message} — fees ficam na treasury, rode de novo`);
      continue;
    }

    // 4. registrar
    await prisma.feePayout.create({
      data: {
        launchpadId: pad.id,
        wallet: pad.ownerWallet,
        mint: pad.quoteMint,
        amountRaw: ownerShare.toString(),
        claimedRaw: claimed.toString(),
        txSig: paySig,
      },
    });
    log(`  pago ${ui(ownerShare)} ${pad.quoteSymbol} -> ${pad.ownerWallet}`);
  }
}

async function main() {
  log(`\n=== Split de fees 50/50 ${DRY_RUN ? '(dry-run)' : ''} ===\n`);
  const connection = L.makeConnection();
  // dry-run so le on-chain — nao precisa da secret
  const treasury =
    DRY_RUN && !process.env.TREASURY_SECRET_BASE58
      ? { publicKey: new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET) }
      : L.loadTreasury();
  const prisma = L.makePrisma();
  const client = new DynamicBondingCurveClient(connection, 'confirmed');
  log(`Treasury: ${treasury.publicKey.toBase58()}`);

  if (LOOP) {
    const interval = Math.max(1, Number(process.env.BOT_INTERVAL_MINUTES || 30)) * 60_000;
    log(`Loop a cada ${interval / 60000} min. Ctrl+C para parar.\n`);
    for (;;) {
      try {
        await runRound({ connection, client, treasury, prisma });
      } catch (e) {
        console.error('[X] rodada falhou:', e.message);
      }
      await L.sleep(interval);
    }
  } else {
    await runRound({ connection, client, treasury, prisma });
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('\n[X]', e.stack || e.message);
  process.exit(1);
});
