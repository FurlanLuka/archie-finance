import { PlaidAccount } from 'react-plaid-link';

import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';

export const transformAccounts = (
  accountsBase: PlaidAccount[],
): PaymentInstrument[] =>
  accountsBase.map((account) => ({
    id: account.id,
    name: account.name,
    mask: account.mask,
    subType: account.subtype,
  }));
