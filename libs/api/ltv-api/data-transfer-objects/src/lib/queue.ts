export class LtvUpdatedPayload {
  userId: string;
  ltv: number;
  calculatedOn: LtvCalculatedOn;
}

export class LtvCalculatedOn {
  collateral: CollateralWithPrice[];
  collateralBalance: number;
  utilizedCreditAmount: number;
  calculatedAt: string;
}

export class LtvPeriodicCheckRequestedPayload {
  userIds: string[];
}

export class CollateralWithPrice {
  asset: string;
  amount: string;
  price: number;
}

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
