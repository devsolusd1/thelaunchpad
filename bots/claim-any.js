#!/usr/bin/env node
/*
 * Claim universal de fees DBC — cola uma secret key e clama TODAS as fees
 * (partner + creator) de qualquer config/pool que essa wallet controla no
 * programa Dynamic Bonding Curve da Meteora.
 *
 * A wallet clama:
 *   - PARTNER fees: de todo pool sob uma config cujo feeClaimer = a wallet
 *   - CREATOR fees: de todo pool criado pela wallet (creator on-chain)
 *
 * A secret NUNCA e' passada por argumento (nao vaza no historico/lista de
 * processos): o .cmd pergunta e passa via variavel de ambiente CLAIM_SECRET.
 *
 * Uso: bots\claim-any.cmd   (ou:  set /p e node bots/claim-any.js)
 *   --dry-run  so mostra o que clamaria, nao assina nada
 */
const readline = require('readline');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const BN = require('bn.js');
const bs58m = require('bs58');
const bs58 = bs58m.default || bs58m;
const {
  DynamicBondingCurveClient,
  U64_MAX,
} = require('@meteora-ag/dynamic-bonding-curve-sdk');
const L = require('./lib');

const DRY = process.argv.includes('--dry-run');
const RECEIVER = (process.env.CLAIM_RECEIVER || '').trim(); // opcional: manda pra outra wallet
const R = '\x1b[0m', B = '\x1b[1m', DIM = '\x1b[2m', GR = '\x1b[32m', YE = '\x1b[33m', RD = '\x1b[31m', CY = '\x1b[36m';

function loadKey() {
  const raw = (process.env.CLAIM_SECRET || '').trim();
  if (!raw) { console.error(`${RD}Nenhuma secret recebida (env CLAIM_SECRET).${R}`); process.exit(1); }
  // aceita base58 (Phantom/Solflare) OU array JSON [1,2,3,...]
  try {
    if (raw.startsWith('[')) return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
    return Keypair.fromSecretKey(bs58.decode(raw));
  } catch (e) {
    console.error(`${RD}Secret invalida: ${e.message}${R}`);
    process.exit(1);
  }
}

async function main() {
  const connection = L.makeConnection();
  const wallet = loadKey();
  const me = wallet.publicKey.toBase58();
  const client = new DynamicBondingCurveClient(connection, 'confirmed');

  console.log(`\n${B}${CY}=== Claim universal DBC ${DRY ? '(dry-run)' : ''} ===${R}`);
  console.log(`wallet: ${B}${me}${R}`);
  if (RECEIVER) console.log(`${YE}fees vao pra: ${RECEIVER}${R}`);
  const bal = await connection.getBalance(wallet.publicKey);
  console.log(`saldo: ${(bal / 1e9).toFixed(4)} SOL${bal < 3e6 ? ` ${RD}(pouco pra gas!)${R}` : ''}\n`);

  // ── junta os pools a clamar (dedup por endereco) ──────────────────
  const targets = new Map(); // pool -> { partner:bool, creator:bool }
  const mark = (pool, role) => {
    const k = pool.toBase58 ? pool.toBase58() : String(pool);
    const cur = targets.get(k) || { partner: false, creator: false };
    cur[role] = true;
    targets.set(k, cur);
  };

  // 1. configs onde a wallet e' o feeClaimer (partner)
  try {
    const configs = await client.state.getPoolConfigsByOwner(wallet.publicKey);
    console.log(`${DIM}configs como partner: ${configs.length}${R}`);
    for (const cfg of configs) {
      const addr = cfg.publicKey || cfg.account?.publicKey;
      if (!addr) continue;
      const pools = await client.state.getPoolsByConfig(new PublicKey(addr));
      for (const p of pools) mark(p.publicKey, 'partner');
    }
  } catch (e) { console.log(`${YE}lookup de configs falhou: ${e.message}${R}`); }

  // 2. pools criados pela wallet (creator)
  try {
    const created = await client.state.getPoolsByCreator(wallet.publicKey);
    console.log(`${DIM}pools como creator: ${created.length}${R}`);
    for (const p of created) mark(p.publicKey, 'creator');
  } catch (e) { console.log(`${YE}lookup de creator falhou: ${e.message}${R}`); }

  if (!targets.size) { console.log(`\n${YE}Nenhum pool DBC encontrado pra essa wallet.${R}`); return; }
  console.log(`\n${B}${targets.size} pool(s) a verificar${R}\n`);

  // ── mede e clama ──────────────────────────────────────────────────
  let claimedPartner = 0n, claimedCreator = 0n;
  for (const [pool, role] of targets) {
    let m;
    try { m = await client.state.getPoolFeeMetrics(new PublicKey(pool)); }
    catch (e) { console.log(`${DIM}${pool.slice(0, 8)}: metrics ${e.message}${R}`); continue; }
    const pf = BigInt(m.current.partnerQuoteFee.toString());
    const cf = BigInt(m.current.creatorQuoteFee.toString());
    const ui = (v) => (Number(v) / 1e9).toFixed(6);
    const bits = [];
    if (role.partner && pf > 0n) bits.push(`partner ${ui(pf)}`);
    if (role.creator && cf > 0n) bits.push(`creator ${ui(cf)}`);
    if (!bits.length) { console.log(`${DIM}${pool.slice(0, 8)}: nada a clamar${R}`); continue; }
    console.log(`${pool.slice(0, 8)}: ${bits.join(' + ')} SOL`);
    if (DRY) { if (role.partner) claimedPartner += pf; if (role.creator) claimedCreator += cf; continue; }

    // partner
    if (role.partner && pf > 0n) {
      try {
        const args = { payer: wallet.publicKey, pool: new PublicKey(pool), maxBaseAmount: new BN(0), maxQuoteAmount: U64_MAX };
        const tx = RECEIVER
          ? await client.partner.claimPartnerTradingFeeToReceiver({ ...args, feeClaimer: wallet.publicKey, receiver: new PublicKey(RECEIVER) })
          : await client.partner.claimPartnerTradingFee({ ...args, feeClaimer: wallet.publicKey });
        await L.sendTx(connection, tx, [wallet], `partner ${pool.slice(0, 8)}`);
        claimedPartner += pf;
      } catch (e) { console.log(`  ${RD}partner falhou: ${e.message}${R}`); }
    }
    // creator
    if (role.creator && cf > 0n) {
      try {
        const args = { payer: wallet.publicKey, pool: new PublicKey(pool), maxBaseAmount: new BN(0), maxQuoteAmount: U64_MAX };
        const tx = RECEIVER
          ? await client.creator.claimCreatorTradingFeeToReceiver({ ...args, creator: wallet.publicKey, receiver: new PublicKey(RECEIVER) })
          : await client.creator.claimCreatorTradingFee({ ...args, creator: wallet.publicKey });
        await L.sendTx(connection, tx, [wallet], `creator ${pool.slice(0, 8)}`);
        claimedCreator += cf;
      } catch (e) { console.log(`  ${RD}creator falhou: ${e.message}${R}`); }
    }
  }

  const ui = (v) => (Number(v) / 1e9).toFixed(6);
  console.log(`\n${B}${GR}${DRY ? 'clamaria' : 'clamado'}: ${ui(claimedPartner)} SOL partner + ${ui(claimedCreator)} SOL creator = ${ui(claimedPartner + claimedCreator)} SOL${R}`);
  if (DRY) console.log(`${DIM}(dry-run — nada foi assinado; rode sem --dry-run pra clamar)${R}`);
}

main().catch((e) => { console.error(`\n${RD}[X] ${e.stack || e.message}${R}`); process.exit(1); });
