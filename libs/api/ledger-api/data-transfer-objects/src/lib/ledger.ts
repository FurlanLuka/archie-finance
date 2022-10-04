export interface InternalLedgerAccountData {
  assetId: string;
  assetAmount: string;
  assetPrice: string;
  accountValue: string;
}

export interface LedgerAccountData {
  assetId: string;
  assetAmount: string;
  accountValue: string;
  calculatedAt: number;
}

export interface Ledger {
  value: string;
  accounts: InternalLedgerAccountData[];
}

export interface LedgerAccountUpdatedPayload {
  userId: string;
  ledgerAccounts: LedgerAccountData[];
}

export interface InitiateLedgerRecalculationCommandPayload {
  userIds: string[];
}
