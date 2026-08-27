// Diagnostico: lista os pools da config da launchpad e mostra os campos
// relevantes (creator, baseMint, config) do jeito que o SDK devolve.
const { PublicKey } = require('@solana/web3.js');
const { DynamicBondingCurveClient, deriveDbcPoolAddress } = require('@meteora-ag/dynamic-bonding-curve-sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Connection } = require('@solana/web3.js');

const CONFIG = process.argv[2] || '5xRFWSs67aGSBmPwaBiMVtc4B6ZTdowuQTo4pa2Vz35w';

(async () => {
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL, 'confirmed');
  const client = new DynamicBondingCurveClient(connection, 'confirmed');
  const pools = await client.state.getPoolsByConfig(new PublicKey(CONFIG));
  console.log(`pools da config ${CONFIG}: ${pools.length}`);
  for (const p of pools) {
    const a = p.account.poolState || p.account;
    console.log('---');
    console.log('pool:     ', p.publicKey.toBase58());
    console.log('baseMint: ', a.baseMint?.toBase58?.());
    console.log('config:   ', a.config?.toBase58?.());
    console.log('creator:  ', a.creator?.toBase58?.());
    console.log('isMigrated:', Number(a.isMigrated));
    console.log('campos:', Object.keys(a).join(', '));

    // o que o verify do site usa:
    const vp = await client.state.getPool(p.publicKey);
    console.log('getPool -> creator:', vp?.creator?.toBase58?.(), '| baseMint:', vp?.baseMint?.toBase58?.(), '| config:', vp?.config?.toBase58?.());
  }
})().catch((e) => {
  console.error('[X]', e.message);
  process.exit(1);
});
