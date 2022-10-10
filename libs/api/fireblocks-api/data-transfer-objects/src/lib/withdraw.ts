export enum CollateralWithdrawalTransactionUpdatedStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
export interface CollateralWithdrawalTransactionSubmittedPayload {
  userId: string;
  assetId: string;
  amount: string;
  transactionId: string;
  internalTransactionId: string;
}

export interface CollateralWithdrawalTransactionUpdatedPayload {
  userId: string;
  assetId: string;
  amount: string;
  networkFee: string;
  transactionId: string;
  internalTransactionId?: string;
  status:
    | CollateralWithdrawalTransactionUpdatedStatus.IN_PROGRESS
    | CollateralWithdrawalTransactionUpdatedStatus.COMPLETED;
}

export interface CollateralWithdrawalTransactionErrorPayload {
  userId: string;
  assetId: string;
  amount: string;
  transactionId?: string;
  internalTransactionId?: string;
}

export interface InitiateCollateralWithdrawalCommandPayload {
  userId: string;
  assetId: string;
  amount: string;
  internalTransactionId: string;
  destinationAddress: string;
}
