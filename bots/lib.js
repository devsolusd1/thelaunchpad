'use strict';
// Helpers compartilhados dos bots — mesmo padrao do bagz-launcher.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const {
  Connection,
  Keypair,
  ComputeBudgetProgram,
  VersionedTransaction,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');
const bs58m = require('bs58');
const bs58 = bs58m.default || bs58m;

const JUP = 'https://lite-api.jup.ag';
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const CU_PRICE = Number(process.env.BOT_CU_PRICE_MICROLAMPORTS || 150000);

const log = (m) => console.log(m);
const warn = (m) => console.log(`  !! ${m}`);
const fail = (m) => {
  console.error(`\n[X] ${m}`);
  process.exit(1);
};

function makeConnection() {
  const url = process.env.NEXT_PUBLIC_RPC_URL;
  if (!url) fail('NEXT_PUBLIC_RPC_URL nao definida no .env');
  return new Connection(url, { commitment: 'confirmed' });
}

function loadTreasury() {
  const secret = (process.env.TREASURY_SECRET_BASE58 || '').trim();
  if (!secret) fail('TREASURY_SECRET_BASE58 nao definida no .env (secret da wallet treasury)');
  let kp;
  try {
    kp = Keypair.fromSecretKey(bs58.decode(secret));
  } catch (e) {
    fail('TREASURY_SECRET_BASE58 invalida (base58 exportado da Phantom/Solflare)');
  }
  const expected = process.env.NEXT_PUBLIC_TREASURY_WALLET;
  if (expected && kp.publicKey.toBase58() !== expected)
    fail(
      `secret nao bate com NEXT_PUBLIC_TREASURY_WALLET (${kp.publicKey.toBase58()} != ${expected})`
    );
  return kp;
}

async function sendTx(connection, tx, signers, label) {
  tx.instructions.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: CU_PRICE })
  );
  const sig = await sendAndConfirmTransaction(connection, tx, signers, {
    commitment: 'confirmed',
    maxRetries: 5,
  });
  log(`  ok ${label}: ${sig}`);
  return sig;
}

async function jupFetch(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Jupiter nao-JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok || body.error)
    throw new Error(`Jupiter ${res.status}: ${body.error || text.slice(0, 200)}`);
  return body;
}

async function jupQuote({ inputMint, outputMint, amount, slippageBps }) {
  const qs = new URLSearchParams({
    inputMint,
    outputMint,
    amount: String(amount),
    slippageBps: String(slippageBps ?? 300),
    restrictIntermediateTokens: 'true',
  });
  return jupFetch(`${JUP}/swap/v1/quote?${qs}`);
}

async function jupSwap({ connection, wallet, quote }) {
  const body = await jupFetch(`${JUP}/swap/v1/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey: wallet.publicKey.toBase58(),
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: {
        priorityLevelWithMaxLamports: {
          maxLamports: Math.max(1, CU_PRICE * 2),
          priorityLevel: 'high',
        },
      },
    }),
  });
  const tx = VersionedTransaction.deserialize(
    Buffer.from(body.swapTransaction, 'base64')
  );
  tx.sign([wallet]);
  const sig = await connection.sendRawTransaction(tx.serialize(), {
    maxRetries: 5,
    skipPreflight: false,
  });
  const conf = await connection.confirmTransaction(
    {
      signature: sig,
      blockhash: tx.message.recentBlockhash,
      lastValidBlockHeight: body.lastValidBlockHeight,
    },
    'confirmed'
  );
  if (conf.value.err)
    throw new Error(`swap falhou: ${JSON.stringify(conf.value.err)} (${sig})`);
  return sig;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Banco dos bots: em producao aponte BOT_DATABASE_URL pro Postgres (Neon)
// e gere o client certo antes: npm run bots:gen
function makePrisma() {
  const { PrismaClient } = require('@prisma/client');
  const url = (process.env.BOT_DATABASE_URL || process.env.DATABASE_URL || '').trim();
  return new PrismaClient(url ? { datasourceUrl: url } : undefined);
}

module.exports = {
  JUP,
  SOL_MINT,
  makePrisma,
  log,
  warn,
  fail,
  makeConnection,
  loadTreasury,
  sendTx,
  jupFetch,
  jupQuote,
  jupSwap,
  sleep,
};
