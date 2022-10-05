import {
  InitiateLedgerRecalculationCommandPayload,
  LedgerAccountData,
  LedgerAccountUpdatedPayload,
} from '@archie/api/ledger-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const initiateLedgerRecalcuationCommandPayloadFactory = (
  overrides?: Partial<InitiateLedgerRecalculationCommandPayload>,
) => ({
  userIds: [user.id],
  ...overrides,
});

export const ledgerAccountDataFactory = (
  overrides?: Partial<LedgerAccountData>,
): LedgerAccountData => ({
  assetId: 'BTC',
  assetAmount: '1',
  accountValue: '20000',
  calculatedAt: Date.now(),
  ...overrides,
});

export const ledgerAccountUpdatedPayloadFactory = (
  overrides?: Partial<LedgerAccountUpdatedPayload>,
): LedgerAccountUpdatedPayload => ({
  userId: user.id,
  ledgerAccounts: [ledgerAccountDataFactory()],
  ...overrides,
});