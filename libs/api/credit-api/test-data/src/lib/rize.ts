import { CardActivatedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const cardActivatedDataFactory = (
  override?: Promise<CardActivatedPayload>,
): CardActivatedPayload => ({
  userId: user.id,
  customerId: 'customerId',
  ...override,
});
