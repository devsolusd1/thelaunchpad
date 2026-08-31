import { Connection, PublicKey } from '@solana/web3.js';
import Nav from '@/components/Nav';
import PadTokenClient from '@/components/PadTokenClient';
import { prisma } from '@/lib/db';
import { SITE_NAME, PAD_MINT, RPC_URL } from '@/lib/env';
import type { PadStats } from '@/components/padtoken-html';

export const metadata = { title: `$PAD — ${SITE_NAME}` };
export const revalidate = 0;

// Dados reais do $PAD: burns registrados pelo bot + supply on-chain.
// Sem PAD_MINT (pre-lancamento), a pagina mostra os numeros ilustrativos.
async function getStats(): Promise<PadStats> {
  if (!PAD_MINT) return null;
  try {
    const bb = await prisma.buyback.findMany({
      where: { tokenMint: PAD_MINT },
      orderBy: { createdAt: 'asc' },
    });

    let dec = 9;
    let circulating: number | null = null;
    try {
      const conn = new Connection(RPC_URL, 'confirmed');
      const s = await conn.getTokenSupply(new PublicKey(PAD_MINT));
      dec = s.value.decimals;
      circulating = s.value.uiAmount;
    } catch {
      /* RPC fora: cai na soma do banco */
    }

    let solSpent = 0;
    let burnedSum = 0;
    let supply = 1e9;
    const burns = bb.map((b) => {
      const amount = Number(b.burnedRaw) / 10 ** dec;
      const sol = Number(b.spentLamports) / 1e9;
      solSpent += sol;
      burnedSum += amount;
      supply -= amount;
      return { t: b.createdAt.toISOString(), sol, amount, tx: b.burnTx, supplyAfter: supply };
    });

    // fonte da verdade do queimado: supply on-chain (pega ate burn manual)
    const burned = circulating != null ? Math.max(0, 1e9 - circulating) : burnedSum;
    return { circulating: circulating ?? 1e9 - burnedSum, burned, solSpent, burns };
  } catch {
    return null;
  }
}

export default async function PadTokenPage() {
  const stats = await getStats();
  return (
    <main>
      <Nav title={SITE_NAME} siteLinks />
      <PadTokenClient stats={stats} />
    </main>
  );
}
