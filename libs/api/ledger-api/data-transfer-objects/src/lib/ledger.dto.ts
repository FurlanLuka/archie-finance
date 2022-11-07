import { InternalLedgerAccountData, Ledger } from './ledger.interfaces';

export class InternalLedgerAccountDataDto implements InternalLedgerAccountData {
  assetId: string;
  assetAmount: string;
  assetPrice: string;
  accountValue: string;
}
export class LedgerDto implements Ledger {
  value: string;
  accounts: InternalLedgerAccountDataDto[];
}
