<<<<<<< HEAD
import { user } from '@archie/test/integration/data-stubs';
import { CollateralDepositTransactionCompletedPayload } from '@archie/api/fireblocks-api/data-transfer-objects';
=======
import { user } from '@archie/test/integration';
import { CollateralDepositTransactionCompletedPayload } from '@archie/api/fireblocks-api/data-transfer-objects/types';
>>>>>>> develop

export const collateralDepositTransactionCompletedPayloadFactory = (
  overrides?: Partial<CollateralDepositTransactionCompletedPayload>,
): CollateralDepositTransactionCompletedPayload => ({
  userId: user.id,
  assetId: 'BTC',
  amount: '1',
  ...overrides,
});
