// Reproduz o caminho do TradePanel: getPool -> unwrap -> getPoolConfig ->
// swapQuote (compra de 0.1 SOL) no pool real do $TEST.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Connection, PublicKey } = require('@solana/web3.js');
const BN = require('bn.js');
const {
  DynamicBondingCurveClient,
  swapQuote,
} = require('@meteora-ag/dynamic-bonding-curve-sdk');

const POOL = 'DDBbZw5Xfbh2NxXcVVMqXmFwqjSxMHLqs8Y9wyzBFoRN';

(async () => {
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL, 'confirmed');
  const client = new DynamicBondingCurveClient(connection, 'confirmed');
  const raw = await client.state.getPool(new PublicKey(POOL));
  const vp = raw?.poolState ?? raw;
  console.log('pool ok, sqrtPrice:', vp.sqrtPrice?.toString?.());
  const cfg = await client.state.getPoolConfig(vp.config);
  console.log('config ok, threshold:', cfg?.migrationQuoteThreshold?.toString?.());
  console.log('config keys:', Object.keys(cfg).slice(0, 20).join(','));

  const amountIn = new BN(String(0.1 * 1e9));
  const currentPoint = new BN(Math.floor(Date.now() / 1000));
  try {
    const q = swapQuote(raw, cfg, false, amountIn, 100, false, currentPoint, false);
    console.log('QUOTE OK');
    console.log('amountOut:', q.amountOut?.toString?.());
    console.log('minimumAmountOut:', q.minimumAmountOut?.toString?.());
    console.log('keys:', Object.keys(q).join(','));
  } catch (e) {
    console.log('QUOTE FALHOU:', e.message);
    console.log(e.stack?.split('\n').slice(0, 5).join('\n'));
  }
})().catch((e) => console.error('[X]', e.message));
