export interface LedgerAccountData {
  assetId: string;
  assetAmount: string;
  assetPrice: string;
  accountValue: string;
}

export interface Ledger {
  value: string;
  accounts: LedgerAccountData[];
}
