import { Group } from '@archie/api/utils/helpers';
import { LedgerAccount } from './ledger_account.entity';

export type LedgerAccountsPerUser = Group<LedgerAccount>;
