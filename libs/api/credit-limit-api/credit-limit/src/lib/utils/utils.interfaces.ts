export interface CollateralValue {
  collateral: CollateralWithPrice[];
  collateralBalance: number;
}

export interface CollateralWithPrice {
  asset: string;
  amount: number;
  price: number;
}

export interface CollateralWithCalculationDate {
  id: string;
  userId: string;
  asset: string;
  amount: number;
  calculatedAt: string;
}
