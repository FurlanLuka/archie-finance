export interface Liquidation {
  asset: string;
  amount: number;
  price: number;
}

export interface MarginCallBase {
  userId: string;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
  ltv: number;
}

export type MarginCallStarted = MarginCallBase;

export type LtvLimitApproaching = MarginCallBase;

export interface MarginCallCompleted extends MarginCallBase {
  liquidation: Liquidation[];
  liquidationAmount: number;
}

export interface DecryptedContact {
  firstName: string;
  email: string;
}
