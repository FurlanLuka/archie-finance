import {
  InternalLedgerAccountData,
  Ledger,
} from './ledger.interfaces';

export class LedgerDto implements Ledger {
  value: string;
  accounts: InternalLedgerAccountData[];
}

