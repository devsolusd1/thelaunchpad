import { PrismaClient } from '@prisma/client';

// Aceita a connection string com qualquer nome/prefixo que a integracao da
// Vercel tenha usado (DATABASE_URL, POSTGRES_*, launchpad_*, ...). Em dev
// (SQLite) DATABASE_URL e' file:// e vale direto.
function findDbUrl(): string {
  const direct = (process.env.DATABASE_URL || '').trim();
  if (direct) return direct;
  const isPg = (v?: string) => /^postgres(ql)?:\/\//.test((v || '').trim());
  const entries = Object.entries(process.env).filter(([, v]) => isPg(v));
  if (entries.length === 0) return '';
  const rank = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes('PRISMA_URL')) return 0;
    if (n.includes('UNPOOLED') || n.includes('NON_POOLING')) return 2;
    if (n.includes('URL')) return 1;
    return 3;
  };
  entries.sort((a, b) => rank(a[0]) - rank(b[0]));
  return (entries[0][1] || '').trim();
}

const dbUrl = findDbUrl();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(dbUrl ? { datasourceUrl: dbUrl } : undefined);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
