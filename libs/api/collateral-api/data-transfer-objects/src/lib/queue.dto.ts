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
  fee: number;
}

export class CollateralWithdrawTransactionCreatedPayload {
  withdrawalId: string;
  transactionId: string;
}

export class InternalCollateralTransactionCompletedPayload {
  transactionId: string;
  userId: string;
  fee: number;
  asset: string;
}
