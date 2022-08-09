import { FC, useState } from 'react';

import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-accounts';
import { ButtonPrimary, ParagraphXS, Select, SelectOption } from '@archie-webapps/shared/ui/design-system';

import { AccountConnectStyled } from './account-connect.styled';

interface AccountConnectProps {
  accounts: AccountResponse[];
  selectAccount: (accountId: string) => void;
}

export const AccountConnect: FC<AccountConnectProps> = ({ accounts, selectAccount }) => {
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);

  const handleConnect = () => {
    if (!selectedAccount) {
      return;
    }

    selectAccount(selectedAccount.id);
  };

  const handleSelect = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);

    setSelectedAccount(account ?? null);
  };

  const header = selectedAccount ? (
    <div>
      <div>
        {selectedAccount.name} {selectedAccount.availableBalance}
      </div>
      <div>
        {selectedAccount.subtype} {selectedAccount.mask} Funds available
      </div>
    </div>
  ) : (
    <span>Select account to connect</span>
  );

  const options = accounts.map((account) => (
    <SelectOption className="account" key={account.id} value={account.id}>
      <div>
        {account.name} {account.availableBalance}
      </div>
      <div>
        {account.subtype} {account.mask} Funds available
      </div>
    </SelectOption>
  ));

  return (
    <AccountConnectStyled>
      <ParagraphXS>Select account to connect</ParagraphXS>
      <Select id="accounts" header={header} onChange={handleSelect}>
        {options}
      </Select>
      <ButtonPrimary onClick={handleConnect} maxWidth="fit-content" disabled={!selectedAccount}>
        Connect to Archie
      </ButtonPrimary>
    </AccountConnectStyled>
  );
};
