import { CardActivatedPayload } from '@archie/api/credit-api/data-transfer-objects/types';
import { user } from '@archie/test/integration';

export const cardActivatedDataFactory = (
  override?: CardActivatedPayload,
): CardActivatedPayload => ({
  userId: user.id,
  customerId: 'customerId',
  ...override,
});
