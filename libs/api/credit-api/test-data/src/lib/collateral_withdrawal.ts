import { CollateralWithdrawInitializedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const collateralWithdrawInitializedDataFactory = (
  override?: Partial<CollateralWithdrawInitializedPayload>,
): CollateralWithdrawInitializedPayload => ({
  asset: 'BTC',
  withdrawalAmount: '1',
  userId: user.id,
  destinationAddress: 'destinationAddress',
  withdrawalId: 'withdrawalId',
  ...override,
});
