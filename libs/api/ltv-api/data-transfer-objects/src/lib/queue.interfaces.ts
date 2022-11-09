export interface MarginCallLtvLimitApproachingPayload {
  userId: string;
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}

export interface MarginCallCompletedPayload {
  completedAt: string;
  userId: string;
  liquidationAmount: number;
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}

export interface MarginCallStartedPayload {
  userId: string;
  startedAt: string;
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}
