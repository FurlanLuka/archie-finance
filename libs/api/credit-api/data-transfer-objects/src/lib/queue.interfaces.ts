import { RizeTransaction } from './transactions.interfaces';

export interface TransactionUpdatedPayload extends RizeTransaction {
  userId: string;
}

export interface CardActivatedPayload {
  userId: string;
  customerId: string;
}

export interface CollateralReceivedPayload {
  userId: string;
}

export interface CollateralDepositCompletedPayload {
  userId: string;
  asset: string;
  amount: string;
  transactionId: string;
}

export interface CollateralLiquidationInitiatedPayload {
  userId: string;
  collateral: {
    asset: string;
    amount: string;
    price: number;
  }[];
}

export interface CollateralWithdrawInitializedPayload {
  asset: string;
  withdrawalAmount: string;
  userId: string;
  destinationAddress: string;
  withdrawalId: string;
}
