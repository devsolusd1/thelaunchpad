// Build da Vercel: encontra a connection string do Postgres seja qual for o
// nome/prefixo que a integracao usou (DATABASE_URL, POSTGRES_*, launchpad_*,
// qualquer um) e roda prisma + next build.
const { execSync } = require('child_process');

const isPg = (v) => /^postgres(ql)?:\/\//.test((v || '').trim());
const entries = Object.entries(process.env).filter(([, v]) => isPg(v));

if (entries.length === 0) {
  console.error(
    '\n[X] Nenhuma variavel de ambiente com connection string Postgres encontrada.\n' +
      '    Crie um banco em Storage -> Create Database e conecte ao projeto\n' +
      '    (todos os ambientes), depois faca o Redeploy.\n'
  );
  process.exit(1);
}

const score = (name, patterns) =>
  patterns.findIndex((p) => name.toUpperCase().includes(p));
const pick = (patterns) => {
  const ranked = entries
    .map(([k, v]) => ({ k, v, s: score(k, patterns) }))
    .sort((a, b) => (a.s === -1 ? 99 : a.s) - (b.s === -1 ? 99 : b.s));
  return ranked[0];
};

// DDL (db push): melhor conexao direta (sem pooler pgbouncer)
const push = pick(['UNPOOLED', 'NON_POOLING', 'PRISMA_URL', 'URL']);
// runtime: melhor pooled/prisma
const runtime = pick(['PRISMA_URL', 'URL']);

console.log(`> db push usando: ${push.k}`);
console.log(`> runtime usando: ${runtime.k}`);

const run = (cmd, url) =>
  execSync(cmd, {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: url.trim() },
  });

run('npx prisma db push --schema=prisma/schema.postgres.prisma --accept-data-loss', push.v);
run('npx prisma generate --schema=prisma/schema.postgres.prisma', runtime.v);
run('npx next build', runtime.v);
