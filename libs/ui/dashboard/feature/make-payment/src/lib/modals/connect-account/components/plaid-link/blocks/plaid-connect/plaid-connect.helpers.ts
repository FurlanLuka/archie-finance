import { PlaidAccount } from 'react-plaid-link';

import { AccountResponse } from '@archie-microservices/ui/shared/data-access/archie-api/plaid/api/get-connected-accounts';

export const transformAccounts = (
  accountsBase: PlaidAccount[],
): AccountResponse[] =>
  accountsBase.map((account) => ({
    id: account.id,
    name: account.name,
    mask: account.mask,
    subtype: account.subtype,
  }));
