import { CardActivatedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { user } from '../../../../test/integration/src/lib/data-stubs';

export const cardActivatedDataFactory = (
  override?: Partial<CardActivatedPayload>,
): CardActivatedPayload => ({
  userId: user.id,
  customerId: 'customerId',
  ...override,
});
