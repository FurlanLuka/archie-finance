import { PlaidAccount } from 'react-plaid-link';

import { ConnectableAccount } from '../../../../connect-acount.interfaces';

export const transformAccounts = (accountsBase: PlaidAccount[]): ConnectableAccount[] => 
  accountsBase.map((account) => ({
    id: account.id,
    name: account.name,
    mask: account.mask,
    type: account.type,
  }));

