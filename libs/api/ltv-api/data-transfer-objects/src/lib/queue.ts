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
  amount: number;
  price: number;
}
