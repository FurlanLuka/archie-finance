import { user } from '@archie/test/integration/stubs';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';

export const ltvUpdatedPayloadFactory = (
  overrides?: Partial<LtvUpdatedPayload>,
): LtvUpdatedPayload => ({
  userId: user.id,
  ltv: 50,
  ...overrides,
});
