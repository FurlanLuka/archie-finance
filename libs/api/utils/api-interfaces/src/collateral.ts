import { TransactionStatus } from 'fireblocks-sdk';

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
  id: string;
  asset: string;
  currentAmount: number;
  withdrawalAmount: number;
  destinationAddress: string;
  status: TransactionStatus;
  createdAt: Date;
}

export type GetUserCollateral = Collateral[];
export type GetUserWithdrawals = GetCollateralWithdrawal[];
export type GetUserWithdrawalAmount = {
  maxAmount: number;
};
