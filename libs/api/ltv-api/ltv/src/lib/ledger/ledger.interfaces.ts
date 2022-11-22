import { LedgerAccount } from './ledger_account.entity';
import { Group } from '@archie/api/utils/helpers';

export type LedgerAccountsPerUser = Group<LedgerAccount>;
