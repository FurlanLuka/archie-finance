export class LtvUpdatedPayload {
  userId: string;
  ltv: number;
  calculatedOn: LtvCalculatedOn;
}

export class LtvCalculatedOn {
  collateral: CollateralWithPrice[];
  collateralBalance: number;
  utilizedCreditAmount: number;
}

export class CollateralWithPrice {
  asset: string;
  amount: number;
  price: number;
}
