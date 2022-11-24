import {
  InitiateLedgerRecalculationCommandPayload,
  LedgerAccountData,
  LedgerAccountsUpdatedPayload,
  LedgerAccountUpdatedPayload,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects/types';
import { user } from '@archie/test/integration/data-stubs';

export const initiateLedgerRecalcuationCommandPayloadFactory = (
  overrides?: Partial<InitiateLedgerRecalculationCommandPayload>,
): InitiateLedgerRecalculationCommandPayload => ({
  batchId: '1957baa0-64a5-4b7c-abb3-ce1edf566680',
  userIds: [user.id],
  ...overrides,
});

export const ledgerAccountDataFactory = (
  overrides?: Partial<LedgerAccountData>,
): LedgerAccountData => ({
  assetId: 'BTC',
  assetAmount: '1',
  accountValue: '20000',
  assetPrice: '20000',
  calculatedAt: new Date().toISOString(),
  ...overrides,
});

export const ledgerAccountUpdatedPayloadFactory = (
  overrides?: Partial<LedgerAccountUpdatedPayload>,
): LedgerAccountUpdatedPayload => ({
  userId: user.id,
  ledgerAccounts: [ledgerAccountDataFactory()],
  action: {
    type: LedgerActionType.DEPOSIT,
  },
  ...overrides,
});

export const ledgerAccountsUpdatedPayloadFactory = (
  overrides?: Partial<LedgerAccountsUpdatedPayload>,
): LedgerAccountsUpdatedPayload => ({
  batchId: '1957baa0-64a5-4b7c-abb3-ce1edf566680',
  ledgers: [ledgerAccountUpdatedPayloadFactory()],
  ...overrides,
});
