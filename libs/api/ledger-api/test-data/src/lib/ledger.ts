import { InitiateLedgerRecalculationCommandPayload } from '@archie/api/ledger-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const initiateLedgerRecalcuationCommandPayloadFactory = (
  overrides?: InitiateLedgerRecalculationCommandPayload,
) => ({
  userIds: [user.id],
  ...overrides,
});
