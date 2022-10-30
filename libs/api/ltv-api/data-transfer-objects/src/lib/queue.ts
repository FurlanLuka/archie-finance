export class MarginCallLtvLimitApproachingPayload {
  userId: string;
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}

export class MarginCallCompletedPayload {
  completedAt: string;
  userId: string;
  liquidationAmount: number;
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}

export class MarginCallStartedPayload {
  userId: string;
  startedAt: string;
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}
