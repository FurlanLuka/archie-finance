import { TransactionStatus } from 'fireblocks-sdk';

export interface FireblocksDepositTransactionPayload {
  transactionId: string;
  assetId: string;
  destinationAddress: string;
  sourceAddress: string;
  networkFee: number;
  amount: number;
  netAmount: number;
  status: TransactionStatus;
}

export interface FireblocksWithdrawTransactionPayload {
  transactionId: string;
  internalTransactionId?: string;
  assetId: string;
  sourceVaultId: string;
  destinationAddress: string;
  amount: number;
  networkFee: number;
  netAmount: number;
  status: TransactionStatus;
}

export interface FireblocksInternalTransactionPayload {
  transactionId: string;
  internalTransactionId?: string;
  assetId: string;
  sourceVaultId: string;
  destinationVaultId: string;
  amount: number;
  netAmount: number;
  networkFee: number;
  status: TransactionStatus;
}
