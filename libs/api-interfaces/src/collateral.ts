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
  currentAmount: number;
  withdrawalAmount: number;
  destinationAddress: string;
}

export interface UserWithdrawal extends CollateralWithdrawal {
  currentAmount: number;
  createdAt: Date;
}

export type GetUserCollateral = Collateral[];
export type GetUserWithdrawals = UserWithdrawal[];
