// Sanity-check: monta e valida as curvas exatamente como o site faz (dbc.ts).
const { PublicKey } = require('@solana/web3.js');
const {
  buildCurveWithMarketCap,
  validateConfigParameters,
  ActivationType,
  TokenType,
  TokenAuthorityOption,
  CollectFeeMode,
  BaseFeeMode,
  MigrationOption,
  MigrationFeeOption,
} = require('@meteora-ag/dynamic-bonding-curve-sdk');

const OPTIONS = [
  [25, MigrationFeeOption.FixedBps25],
  [30, MigrationFeeOption.FixedBps30],
  [100, MigrationFeeOption.FixedBps100],
  [200, MigrationFeeOption.FixedBps200],
  [400, MigrationFeeOption.FixedBps400],
  [600, MigrationFeeOption.FixedBps600],
];
const nearest = (bps) =>
  OPTIONS.reduce((b, o) => (Math.abs(o[0] - bps) < Math.abs(b[0] - bps) ? o : b))[1];

function build({ feeBps, quoteDecimals, initialMcUsd, migrationMcUsd, quoteUsdPrice }) {
  return buildCurveWithMarketCap({
    token: {
      tokenType: TokenType.SPLToken,
      tokenBaseDecimal: 9,
      tokenQuoteDecimal: quoteDecimals,
      tokenAuthorityOption: TokenAuthorityOption.Immutable,
      totalTokenSupply: 1_000_000_000,
      leftover: 0,
    },
    fee: {
      baseFeeParams: {
        baseFeeMode: BaseFeeMode.FeeSchedulerLinear,
        feeSchedulerParam: {
          startingFeeBps: feeBps,
          endingFeeBps: feeBps,
          numberOfPeriod: 0,
          totalDuration: 0,
        },
      },
      dynamicFeeEnabled: false,
      collectFeeMode: CollectFeeMode.QuoteToken,
      creatorTradingFeePercentage: 0,
      poolCreationFee: 0,
      enableFirstSwapWithMinFee: false,
    },
    migration: {
      migrationOption: MigrationOption.MET_DAMM_V2,
      migrationFeeOption: nearest(feeBps),
      migrationFee: { feePercentage: 0, creatorFeePercentage: 0 },
    },
    liquidityDistribution: {
      partnerPermanentLockedLiquidityPercentage: 100,
      partnerLiquidityPercentage: 0,
      creatorPermanentLockedLiquidityPercentage: 0,
      creatorLiquidityPercentage: 0,
    },
    lockedVesting: {
      totalLockedVestingAmount: 0,
      numberOfVestingPeriod: 0,
      cliffUnlockAmount: 0,
      totalVestingDuration: 0,
      cliffDurationFromMigrationTime: 0,
    },
    activationType: ActivationType.Timestamp,
    initialMarketCap: initialMcUsd / quoteUsdPrice,
    migrationMarketCap: migrationMcUsd / quoteUsdPrice,
  });
}

const treasury = new PublicKey('AMyPkHHuJLAXP176an8ZizfbBifWjsadjkwgbLpkjgT6');
const cases = [
  { name: 'SOL 2% 5k->69k', feeBps: 200, quoteDecimals: 9, initialMcUsd: 5000, migrationMcUsd: 69000, quoteUsdPrice: 200 },
  { name: 'SOL 10% 1k->1.5k (minimos)', feeBps: 1000, quoteDecimals: 9, initialMcUsd: 1000, migrationMcUsd: 1500, quoteUsdPrice: 200 },
  { name: 'SOL 5% 20k->1bi (cauda longa)', feeBps: 500, quoteDecimals: 9, initialMcUsd: 20000, migrationMcUsd: 1_000_000_000, quoteUsdPrice: 200 },
  { name: 'USDC 3% 10k->100k', feeBps: 300, quoteDecimals: 6, initialMcUsd: 10000, migrationMcUsd: 100000, quoteUsdPrice: 1 },
  { name: 'USDC 2% 1k->2k', feeBps: 200, quoteDecimals: 6, initialMcUsd: 1000, migrationMcUsd: 2000, quoteUsdPrice: 1 },
];

let fails = 0;
for (const c of cases) {
  try {
    const p = build(c);
    validateConfigParameters({ ...p, leftoverReceiver: treasury });
    const threshold = p.migrationQuoteThreshold.toString();
    console.log(`OK  ${c.name}  threshold=${Number(threshold) / 10 ** c.quoteDecimals} ${c.quoteDecimals === 9 ? 'SOL' : 'USDC'}`);
  } catch (e) {
    fails++;
    console.log(`FAIL ${c.name}: ${e.message}`);
  }
}
process.exit(fails ? 1 : 0);
