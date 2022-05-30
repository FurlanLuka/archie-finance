export interface CollateralValue {
  asset: string;
  assetAmount: number;
  price: number;
}

export type GetCollateralValueResponse = CollateralValue[];

export interface Collateral {
  asset: string;
  amount: number;
}

export type GetUserCollateral = Collateral[];
