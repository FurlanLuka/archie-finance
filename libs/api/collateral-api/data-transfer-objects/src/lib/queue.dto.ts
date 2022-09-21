import { TransactionStatus } from 'fireblocks-sdk';
import { AssetType } from '@archie/api/collateral-api/asset-information';

export class CollateralDepositedPayload {
  transactionId: string;
  userId: string;
  asset: string;
  amount: string;
  destination: string;
  status: TransactionStatus;
}

export class CollateralWithdrawCompletedPayload {
  asset: string;
  transactionId: string;
  userId: string;
  fee: string;
}

export class CollateralWithdrawTransactionCreatedPayload {
  withdrawalId: string;
  transactionId: string;
}

export class InternalCollateralTransactionCompletedPayload {
  transactionId: string;
  userId: string;
  fee: string;
  asset: string;
}

export class CollateralWithdrawInitializedPayload {
  asset: string;
  withdrawalAmount: string;
  userId: string;
  destinationAddress: string;
  withdrawalId: string;
}

export class InternalCollateralTransactionCreatedPayload {
  userId: string;
  id: string;
  amount: string;
  price: number;
  network: AssetType;
  asset: string;
}
