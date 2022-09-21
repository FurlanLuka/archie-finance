import {
  InternalCollateralTransactionCreatedPayload,
  InternalCollateralTransactionCompletedPayload,
  CollateralWithdrawCompletedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';
import { user } from '@archie/test/integration';
import { AssetType } from '@archie/api/collateral-api/asset-information';

export const internalCollateralTransactionCreatedDataFactory = (
  override?: Partial<InternalCollateralTransactionCreatedPayload>,
): InternalCollateralTransactionCreatedPayload => ({
  userId: user.id,
  id: 'id',
  amount: '1',
  price: 10,
  network: AssetType.BTC,
  asset: 'BTC',
  ...override,
});

export const internalCollateralTransactionCompletedDataFactory = (
  override?: Partial<InternalCollateralTransactionCompletedPayload>,
): InternalCollateralTransactionCompletedPayload => ({
  transactionId: 'transactionId',
  userId: user.id,
  fee: '0.1',
  asset: 'BTC',
  ...override,
});

export const collateralWithdrawCompletedDataFactory = (
  override?: Partial<CollateralWithdrawCompletedPayload>,
): CollateralWithdrawCompletedPayload => ({
  asset: 'BTC',
  transactionId: 'transactionId',
  userId: user.id,
  fee: '0.1',
  ...override,
});
