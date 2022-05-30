export interface CollateralValue {
  asset: string;
  assetAmount: number;
  price: number;
}

export type GetCollateralValueResponse = CollateralValue[];

export type GetTotalCollateralValueResponse = {
  value: number;
};

export interface Collateral {
  asset: string;
  amount: number;
}

export type GetUserCollateral = Collateral[];
