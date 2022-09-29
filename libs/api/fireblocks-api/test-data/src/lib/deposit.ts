import { user } from '@archie/test/integration';
import { CollateralDepositTransactionCompletedPayload } from '@archie/api/fireblocks-api/data-transfer-objects';

export const collateralDepositTransactionCompletedPayloadFactory = (
  overrides?: Partial<CollateralDepositTransactionCompletedPayload>,
): CollateralDepositTransactionCompletedPayload => ({
  userId: user.id,
  assetId: 'BTC',
  amount: '1',
  ...overrides,
});
