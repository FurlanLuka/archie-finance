export class LtvLimitApproachingPayload {
  userId: string;
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}

export class MarginCallCompletedPayload {
  userId: string;
  completedAt: string;
  liquidation: {
    asset: string;
    amount: string;
    price: number;
  }[];
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
