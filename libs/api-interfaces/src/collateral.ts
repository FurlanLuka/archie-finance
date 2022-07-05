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

export interface CollateralWithdrawal {
  asset: string;
  amount: number;
  destinationAddress: string;
}

export type GetUserCollateral = Collateral[];
