import { CollateralDepositCompletedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const collateralDepositCompletedDataFactory = (
  override?: Partial<CollateralDepositCompletedPayload>,
): CollateralDepositCompletedPayload => ({
  asset: 'BTC',
  userId: user.id,
  amount: '1',
  transactionId: 'transactionId',
  ...override,
});
