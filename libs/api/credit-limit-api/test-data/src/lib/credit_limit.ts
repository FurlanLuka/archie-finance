import { CreditLineCreatedPayload } from '@archie/api/credit-limit-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const creditLineCreatedDataFactory = (
  override?: Partial<CreditLineCreatedPayload>,
): CreditLineCreatedPayload => ({
  userId: user.id,
  amount: 500,
  ...override,
});
