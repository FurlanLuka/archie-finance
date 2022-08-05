import { FC } from 'react';

import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-accounts';

interface AccountConnectProps {
  accounts: AccountResponse[];
}

export const AccountConnect: FC<AccountConnectProps> = ({ accounts }) => {
  return <div>{accounts.map((account) => JSON.stringify(account))}</div>;
};
