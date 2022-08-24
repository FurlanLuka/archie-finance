import { TransactionStatus } from 'fireblocks-sdk';

export class CollateralDepositedPayload {
  transactionId: string;
  userId: string;
  asset: string;
  amount: number;
  destination: string;
  status: TransactionStatus;
}

export class CollateralWithdrawCompletedPayload {
  asset: string;
  transactionId: string;
  userId: string;
}

export class CollateralWithdrawTransactionCreatedPayload {
  withdrawalId: string;
  transactionId: string;
}
