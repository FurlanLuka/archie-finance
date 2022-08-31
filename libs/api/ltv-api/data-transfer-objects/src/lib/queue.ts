export class LtvUpdatedPayload {
  userId: string;
  ltv: number;
  calculatedOn: LtvCalculationInfo;
}

export class LtvCalculationInfo {
  collateral: CollateralWithPrice[];
  collateralBalance: number;
  utilizedCreditAmount: number;
}

export class CollateralWithPrice {
  asset: string;
  amount: number;
  price: number;
}
