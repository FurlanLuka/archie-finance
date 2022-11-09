import { user } from '@archie/test/integration';
import {
  CollateralWithdrawalTransactionErrorPayload,
  CollateralWithdrawalTransactionSubmittedPayload,
  CollateralWithdrawalTransactionUpdatedPayload,
  CollateralWithdrawalTransactionUpdatedStatus,
  InitiateCollateralWithdrawalCommandPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects/types';

export const collateralWithdrawalTransactionSubmittedPayloadFactory = (
  overrides?: Partial<CollateralWithdrawalTransactionSubmittedPayload>,
): CollateralWithdrawalTransactionSubmittedPayload => ({
  userId: user.id,
  assetId: 'ETH',
  amount: '1',
  transactionId: 'transactionId',
  internalTransactionId: 'InternalTransactionId',
  ...overrides,
});

export const collateralWithdrawalTransactionUpdatedPayloadFactory = (
  overrides?: Partial<CollateralWithdrawalTransactionUpdatedPayload>,
): CollateralWithdrawalTransactionUpdatedPayload => ({
  userId: user.id,
  assetId: 'ETH',
  amount: '1',
  networkFee: '0,00000000193',
  transactionId: 'transactionId',
  internalTransactionId: 'InternalTransactionId',
  status: CollateralWithdrawalTransactionUpdatedStatus.IN_PROGRESS,
  ...overrides,
});

export const collateralWithdrawalTransactionErrorPayloadFactory = (
  overrides?: Partial<CollateralWithdrawalTransactionErrorPayload>,
): CollateralWithdrawalTransactionErrorPayload => ({
  userId: user.id,
  assetId: 'ETH',
  amount: '1',
  transactionId: 'transactionId',
  internalTransactionId: 'InternalTransactionId',
  ...overrides,
});

export const initiateCollateralWithdrawalCommandPayloadFactory = (
  overrides?: Partial<InitiateCollateralWithdrawalCommandPayload>,
): InitiateCollateralWithdrawalCommandPayload => ({
  userId: user.id,
  assetId: 'BTC',
  amount: '1',
  internalTransactionId: 'internalTransactionId',
  destinationAddress: '',
  ...overrides,
});
