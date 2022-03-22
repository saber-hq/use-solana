import { PublicKeyLayout, Uint64Layout } from "@saberhq/token-utils";
import * as BufferLayout from "@solana/buffer-layout";

/**
 * Raw representation of fees.
 */
export interface RawFees {
  adminTradeFeeNumerator: Uint8Array;
  adminTradeFeeDenominator: Uint8Array;
  adminWithdrawFeeNumerator: Uint8Array;
  adminWithdrawFeeDenominator: Uint8Array;
  tradeFeeNumerator: Uint8Array;
  tradeFeeDenominator: Uint8Array;
  withdrawFeeNumerator: Uint8Array;
  withdrawFeeDenominator: Uint8Array;
}

/**
 * Layout for StableSwap fees
 */
export const FeesLayout = BufferLayout.struct<RawFees>(
  [
    Uint64Layout("adminTradeFeeNumerator"),
    Uint64Layout("adminTradeFeeDenominator"),
    Uint64Layout("adminWithdrawFeeNumerator"),
    Uint64Layout("adminWithdrawFeeDenominator"),
    Uint64Layout("tradeFeeNumerator"),
    Uint64Layout("tradeFeeDenominator"),
    Uint64Layout("withdrawFeeNumerator"),
    Uint64Layout("withdrawFeeDenominator"),
  ],
  "fees"
);

/**
 * Raw representation of a fraction.
 */
export interface RawFraction {
  numerator: Uint8Array;
  denominator: Uint8Array;
}

/**
 * Layout for fraction.
 */
export const FractionLayout = (name: string) => {
  return BufferLayout.struct<RawFraction>(
    [Uint64Layout("numerator"), Uint64Layout("denominator")],
    name
  );
};

export type LegacyStableSwapLayoutStruct = {
  isInitialized: 0 | 1;
  isPaused: 0 | 1;
  nonce: number;
  initialAmpFactor: Uint8Array;
  targetAmpFactor: Uint8Array;
  startRampTs: number;
  stopRampTs: number;
  futureAdminDeadline: number;
  futureAdminAccount: Uint8Array;
  adminAccount: Uint8Array;
  tokenAccountA: Uint8Array;
  tokenAccountB: Uint8Array;
  tokenPool: Uint8Array;
  mintA: Uint8Array;
  mintB: Uint8Array;
  adminFeeAccountA: Uint8Array;
  adminFeeAccountB: Uint8Array;
  fees: RawFees;
};

export type StableSwapLayoutStruct = LegacyStableSwapLayoutStruct & {
  exchangeRateOverrideA: RawFraction;
  exchangeRateOverrideB: RawFraction;
};

const LegacyStableSwapLayoutFields = [
  BufferLayout.u8("isInitialized"),
  BufferLayout.u8("isPaused"),
  BufferLayout.u8("nonce"),
  Uint64Layout("initialAmpFactor"),
  Uint64Layout("targetAmpFactor"),
  BufferLayout.ns64("startRampTs"),
  BufferLayout.ns64("stopRampTs"),
  BufferLayout.ns64("futureAdminDeadline"),
  PublicKeyLayout("futureAdminAccount"),
  PublicKeyLayout("adminAccount"),
  PublicKeyLayout("tokenAccountA"),
  PublicKeyLayout("tokenAccountB"),
  PublicKeyLayout("tokenPool"),
  PublicKeyLayout("mintA"),
  PublicKeyLayout("mintB"),
  PublicKeyLayout("adminFeeAccountA"),
  PublicKeyLayout("adminFeeAccountB"),
  FeesLayout,
];

const ExchangeRateOverrideLayoutFields = [
  FractionLayout("exchangeRateOverrideA"),
  FractionLayout("exchangeRateOverrideB"),
];

const StableSwapLayoutFields = (<
  (
    | typeof LegacyStableSwapLayoutFields[number]
    | typeof ExchangeRateOverrideLayoutFields[number]
  )[]
>LegacyStableSwapLayoutFields).concat(ExchangeRateOverrideLayoutFields);

export const LegacyStableSwapLayout =
  BufferLayout.struct<LegacyStableSwapLayoutStruct>(
    LegacyStableSwapLayoutFields
  );

/**
 * Layout for stable swap state
 */
export const StableSwapLayout = BufferLayout.struct<StableSwapLayoutStruct>(
  StableSwapLayoutFields
);
