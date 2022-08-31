export class LtvLimitApproachingPayload {
  userId: string;
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}

export class MarginCallCompletedPayload {
  userId: string;
  liquidation: {
    asset: string;
    amount: number;
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
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}
