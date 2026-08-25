// Construcao da curva DBC de uma launchpad — mesmo padrao validado em
// mainnet pelo bagz-launcher (buildCurveWithMarketCap espera MC na unidade
// do QUOTE, nao em USD).
import {
  buildCurveWithMarketCap,
  validateConfigParameters,
  ActivationType,
  TokenType,
  TokenAuthorityOption,
  CollectFeeMode,
  BaseFeeMode,
  MigrationOption,
  MigrationFeeOption,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_SUPPLY, TOKEN_DECIMALS } from './env';

// A fee do pool DAMM pos-graduacao so aceita valores fixos; escolhemos o
// mais proximo da fee da launchpad (nunca acima do dobro).
const MIGRATION_FEE_OPTIONS: Array<[number, MigrationFeeOption]> = [
  [25, MigrationFeeOption.FixedBps25],
  [30, MigrationFeeOption.FixedBps30],
  [100, MigrationFeeOption.FixedBps100],
  [200, MigrationFeeOption.FixedBps200],
  [400, MigrationFeeOption.FixedBps400],
  [600, MigrationFeeOption.FixedBps600],
];

export function nearestMigrationFeeOption(feeBps: number): MigrationFeeOption {
  let best = MIGRATION_FEE_OPTIONS[0];
  for (const opt of MIGRATION_FEE_OPTIONS) {
    if (Math.abs(opt[0] - feeBps) < Math.abs(best[0] - feeBps)) best = opt;
  }
  return best[1];
}

export interface LaunchpadCurveInput {
  feeBps: number; // 200..1000
  quoteDecimals: number; // 9 (SOL) | 6 (USDC)
  initialMcUsd: number;
  migrationMcUsd: number;
  quoteUsdPrice: number; // preco do quote em USD (USDC = 1)
}

export function buildLaunchpadCurve(input: LaunchpadCurveInput) {
  const initialMarketCap = input.initialMcUsd / input.quoteUsdPrice;
  const migrationMarketCap = input.migrationMcUsd / input.quoteUsdPrice;

  return buildCurveWithMarketCap({
    token: {
      tokenType: TokenType.SPLToken,
      tokenBaseDecimal: TOKEN_DECIMALS,
      tokenQuoteDecimal: input.quoteDecimals,
      tokenAuthorityOption: TokenAuthorityOption.Immutable,
      totalTokenSupply: TOKEN_SUPPLY,
      leftover: 0,
    },
    fee: {
      baseFeeParams: {
        baseFeeMode: BaseFeeMode.FeeSchedulerLinear,
        feeSchedulerParam: {
          startingFeeBps: input.feeBps,
          endingFeeBps: input.feeBps,
          numberOfPeriod: 0,
          totalDuration: 0,
        },
      },
      dynamicFeeEnabled: false,
      // fee sempre no quote -> facil de dividir 50/50 e de fazer buyback
      collectFeeMode: CollectFeeMode.QuoteToken,
      // 100% da fee (pos-Meteora) vai pro partner (treasury da plataforma);
      // o bot reparte metade com o dono da launchpad off-chain
      creatorTradingFeePercentage: 0,
      poolCreationFee: 0,
      enableFirstSwapWithMinFee: false,
    },
    migration: {
      migrationOption: MigrationOption.MET_DAMM_V2,
      migrationFeeOption: nearestMigrationFeeOption(input.feeBps),
      migrationFee: { feePercentage: 0, creatorFeePercentage: 0 },
    },
    liquidityDistribution: {
      // LP pos-graduacao 100% travado em nome do partner; as fees dele
      // tambem entram no split 50/50 via bot
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
    initialMarketCap,
    migrationMarketCap,
  });
}

export function validateLaunchpadCurve(
  params: ReturnType<typeof buildLaunchpadCurve>,
  leftoverReceiver: PublicKey
) {
  validateConfigParameters({ ...params, leftoverReceiver } as Parameters<
    typeof validateConfigParameters
  >[0]);
}
