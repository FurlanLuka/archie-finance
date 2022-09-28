export interface CollateralValue {
  collateral: CollateralWithPrice[];
  collateralBalance: number;
}

export interface CollateralWithPrice {
  asset: string;
  amount: string;
  price: number;
}

export interface CollateralWithCalculationDate {
  id: string;
  userId: string;
  asset: string;
  amount: string;
  calculatedAt: string;
}

export interface CreditLimitPerAsset {
  asset: string;
  limit: number;
  utilizationPercentage: number;
}

export interface CreditLimitPerAssetWithCreditLimitTarget {
  targetLimit: number;
  assets: CreditLimitPerAsset[];
}
