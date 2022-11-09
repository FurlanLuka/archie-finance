<<<<<<< HEAD
import { CardActivatedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { user } from '@archie/test/integration/data-stubs';
=======
import { CardActivatedPayload } from '@archie/api/credit-api/data-transfer-objects/types';
import { user } from '@archie/test/integration';
>>>>>>> develop

export const cardActivatedDataFactory = (
  override?: Partial<CardActivatedPayload>,
): CardActivatedPayload => ({
  userId: user.id,
  customerId: 'customerId',
  ...override,
});
