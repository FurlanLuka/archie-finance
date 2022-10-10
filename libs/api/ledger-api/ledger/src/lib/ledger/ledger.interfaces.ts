import { AssetInformation } from '@archie/api/ledger-api/assets';

export type BatchDecrementLedgerAccounts = {
  asset: AssetInformation;
  amount: string;
}[];
