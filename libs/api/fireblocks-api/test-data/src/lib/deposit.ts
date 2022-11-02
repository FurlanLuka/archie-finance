import { user } from '../../../../test/integration/src/lib/data-stubs';
import { CollateralDepositTransactionCompletedPayload } from '@archie/api/fireblocks-api/data-transfer-objects';

export const collateralDepositTransactionCompletedPayloadFactory = (
  overrides?: Partial<CollateralDepositTransactionCompletedPayload>,
): CollateralDepositTransactionCompletedPayload => ({
  userId: user.id,
  assetId: 'BTC',
  amount: '1',
  ...overrides,
});
