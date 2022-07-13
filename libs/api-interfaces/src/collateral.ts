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

export interface GetCollateralWithdrawal {
  asset: string;
  currentAmount: number;
  withdrawalAmount: number;
  destinationAddress: string;
  createdAt: Date;
}

export type GetUserCollateral = Collateral[];
export type GetUserWithdrawals = GetCollateralWithdrawal[];
