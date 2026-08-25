// Verificacoes on-chain feitas pelo servidor antes de registrar qualquer
// coisa no banco — o cliente nunca e' confiavel.
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  DynamicBondingCurveClient,
  feeNumeratorToBps,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { RPC_URL, TREASURY_WALLET, CREATION_FEE_SOL } from './env';

export function serverConnection() {
  return new Connection(RPC_URL, { commitment: 'confirmed' });
}

export interface VerifiedConfig {
  feeBps: number;
  quoteMint: string;
}

// Confere que o config existe, que o feeClaimer e' o treasury da plataforma
// e devolve a fee/quote reais lidos on-chain.
export async function verifyLaunchpadConfig(
  configKey: string
): Promise<VerifiedConfig> {
  const connection = serverConnection();
  const client = new DynamicBondingCurveClient(connection, 'confirmed');
  const cfg = await client.state.getPoolConfig(new PublicKey(configKey));
  if (!cfg) throw new Error('config nao encontrado on-chain');

  const feeClaimer = (cfg as any).feeClaimer?.toBase58?.();
  if (feeClaimer !== TREASURY_WALLET)
    throw new Error('feeClaimer do config nao e o treasury da plataforma');

  const cliff = (cfg as any).poolFees?.baseFee?.cliffFeeNumerator;
  const feeBps = cliff ? feeNumeratorToBps(cliff) : 0;
  const quoteMint = (cfg as any).quoteMint?.toBase58?.() || '';
  return { feeBps, quoteMint };
}

// Confere que a transacao pagou a taxa de criacao (0.5 SOL) pro treasury.
export async function verifyCreationPayment(txSig: string): Promise<void> {
  const connection = serverConnection();
  const tx = await connection.getTransaction(txSig, {
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 0,
  });
  if (!tx || tx.meta?.err) throw new Error('transacao de criacao invalida');

  const keys = tx.transaction.message.staticAccountKeys.map((k) => k.toBase58());
  const idx = keys.indexOf(TREASURY_WALLET);
  if (idx < 0) throw new Error('treasury nao aparece na transacao');
  const delta =
    (tx.meta!.postBalances[idx] || 0) - (tx.meta!.preBalances[idx] || 0);
  const expected = CREATION_FEE_SOL * LAMPORTS_PER_SOL;
  if (delta < expected * 0.999)
    throw new Error(
      `pagamento da taxa de criacao nao encontrado (recebido ${delta / LAMPORTS_PER_SOL} SOL)`
    );
}

// Confere que o pool existe, pertence ao config da launchpad e usa o mint dado.
export async function verifyTokenPool(
  pool: string,
  mint: string,
  configKey: string
): Promise<void> {
  const connection = serverConnection();
  const client = new DynamicBondingCurveClient(connection, 'confirmed');
  const vp = await client.state.getPool(new PublicKey(pool));
  if (!vp) throw new Error('pool nao encontrado on-chain');
  if ((vp as any).config?.toBase58?.() !== configKey)
    throw new Error('pool nao pertence ao config desta launchpad');
  if ((vp as any).baseMint?.toBase58?.() !== mint)
    throw new Error('mint nao bate com o pool');
}
