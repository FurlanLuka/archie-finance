import { user } from '../../../../test/integration/src/lib/data-stubs';
import {
  CollateralLiquidationTransactionErrorPayload,
  CollateralLiquidationTransactionSubmittedPayload,
  CollateralLiquidationTransactionUpdatedPayload,
  CollateralLiquidationTransactionUpdatedStatus,
  InitiateCollateralLiquidationCommandPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects';

export const collateralLiquidationTransactionSubmittedPayloadFactory = (
  overrides?: Partial<CollateralLiquidationTransactionSubmittedPayload>,
): CollateralLiquidationTransactionSubmittedPayload => ({
  userId: user.id,
  assetId: 'ETH',
  amount: '1',
  transactionId: 'transactionId',
  internalTransactionId: 'InternalTransactionId',
  ...overrides,
});

export const collateralLiquidationTransactionUpdatedPayloadFactory = (
  overrides?: Partial<CollateralLiquidationTransactionUpdatedPayload>,
): CollateralLiquidationTransactionUpdatedPayload => ({
  userId: user.id,
  assetId: 'ETH',
  amount: '1',
  networkFee: '0,00000000193',
  transactionId: 'transactionId',
  internalTransactionId: 'InternalTransactionId',
  status: CollateralLiquidationTransactionUpdatedStatus.IN_PROGRESS,
  ...overrides,
});

export const collateralLiquidationTransactionErrorPayloadFactory = (
  overrides?: Partial<CollateralLiquidationTransactionErrorPayload>,
): CollateralLiquidationTransactionErrorPayload => ({
  userId: user.id,
  assetId: 'ETH',
  amount: '1',
  transactionId: 'transactionId',
  internalTransactionId: 'InternalTransactionId',
  ...overrides,
});

export const initiateCollateralLiquidationCommandPayloadFactory = (
  overrides?: Partial<InitiateCollateralLiquidationCommandPayload>,
): InitiateCollateralLiquidationCommandPayload => ({
  userId: user.id,
  assetId: 'BTC',
  amount: '1',
  internalTransactionId: 'internalTransactionId',
  ...overrides,
});
