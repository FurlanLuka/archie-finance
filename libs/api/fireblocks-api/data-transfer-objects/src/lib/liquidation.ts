export interface InitiateCollateralLiquidationCommandPayload {
  userId: string;
  assetId: string;
  amount: string;
  internalTransactionId: string;
}

export enum CollateralLiquidationTransactionUpdatedStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
export interface CollateralLiquidationTransactionSubmittedPayload {
  userId: string;
  assetId: string;
  amount: string;
  transactionId: string;
  internalTransactionId: string;
}

export interface CollateralLiquidationTransactionUpdatedPayload {
  userId: string;
  assetId: string;
  amount: string;
  networkFee: string;
  transactionId: string;
  internalTransactionId?: string;
  status:
    | CollateralLiquidationTransactionUpdatedStatus.IN_PROGRESS
    | CollateralLiquidationTransactionUpdatedStatus.COMPLETED;
}

export interface CollateralLiquidationTransactionErrorPayload {
  userId: string;
  assetId: string;
  amount: string;
  transactionId?: string;
  internalTransactionId?: string;
}

export interface InitiateCollateralLiquidationCommandPayload {
  userId: string;
  assetId: string;
  amount: string;
  internalTransactionId: string;
}
