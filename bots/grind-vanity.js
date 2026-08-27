#!/usr/bin/env node
/*
 * Minera keypairs vanity com sufixo desejado (case-sensitive, base58).
 * Uso: node bots/grind-vanity.js [SUFIXO] [QTD]   (default: PAD 1)
 * Salva em vanity/<pubkey>.json (array de bytes, formato solana-keygen)
 * e mostra a secret em base58 pra colar no campo "custom mint" do site.
 * A pasta vanity/ esta no .gitignore — NUNCA commitar.
 */
const fs = require('fs');
const path = require('path');
const { Keypair } = require('@solana/web3.js');
const bs58m = require('bs58');
const bs58 = bs58m.default || bs58m;

const suffix = process.argv[2] || 'PAD';
const count = Number(process.argv[3] || 1);
const outDir = path.join(__dirname, '..', 'vanity');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

console.log(`Minerando ${count} mint(s) terminando em "${suffix}"...`);
const t0 = Date.now();
let attempts = 0;
let found = 0;

while (found < count) {
  const kp = Keypair.generate();
  attempts++;
  const pub = kp.publicKey.toBase58();
  if (pub.endsWith(suffix)) {
    found++;
    const file = path.join(outDir, `${pub}.json`);
    fs.writeFileSync(file, JSON.stringify(Array.from(kp.secretKey)));
    console.log(`\n[${found}/${count}] ${pub}`);
    console.log(`  secret (base58): ${bs58.encode(kp.secretKey)}`);
    console.log(`  arquivo: ${file}`);
  }
  if (attempts % 100000 === 0)
    process.stdout.write(
      `\r  ${attempts.toLocaleString()} tentativas (${Math.round(attempts / ((Date.now() - t0) / 1000))}/s)`
    );
}
console.log(
  `\nConcluido: ${attempts.toLocaleString()} tentativas em ${((Date.now() - t0) / 1000).toFixed(1)}s`
);
