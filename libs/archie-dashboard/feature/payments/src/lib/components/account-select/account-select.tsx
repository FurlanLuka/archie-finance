import { FC, useMemo, useState } from 'react';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { useGetLinkableAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-linkable-accounts';
import { ButtonPrimary, Loader, ParagraphXS, Select, SelectOption } from '@archie-webapps/shared/ui/design-system';

import { AccountSelectStyled } from './account-select.styled';

interface AccountSelectProps {
  itemId: string;
}

// rework so it fetches accounts for item, onConfirm call connect endpoint
export const AccountSelect: FC<AccountSelectProps> = ({ itemId }) => {
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);

  const getLinkableAccountsResponse = useGetLinkableAccounts(itemId);

  const handleConfirmClick = () => {
    if (!selectedAccount) {
      return;
    }
  };

  const handleSelect = (account: AccountResponse) => {
    setSelectedAccount(account);
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

  const options = useMemo(() => {
    if (getLinkableAccountsResponse.state === RequestState.SUCCESS) {
      return getLinkableAccountsResponse.data.map((account) => (
        <SelectOption className="account" key={account.id} value={account.id}>
          <div>
            {account.name} {account.availableBalance}
          </div>
          <div>
            {account.subtype} {account.mask} Funds available
          </div>
        </SelectOption>
      ));
    }
    return [];
  }, [getLinkableAccountsResponse]);

  function getContent() {
    if (getLinkableAccountsResponse.state === RequestState.LOADING) {
      return (
        <>
          <Loader />
          <ButtonPrimary maxWidth="fit-content" isLoading>
            Connect to Archie
          </ButtonPrimary>
        </>
      );
    }

    if (getLinkableAccountsResponse.state === RequestState.ERROR) {
      // TODO error handling
      return <div>Something went wrong :(</div>;
    }

    if (getLinkableAccountsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <Select id="accounts" header={header} onChange={handleSelect}>
            {options}
          </Select>
          <ButtonPrimary onClick={handleConfirmClick} maxWidth="fit-content" disabled={!selectedAccount}>
            Connect to Archie
          </ButtonPrimary>
        </>
      );
    }

    return <></>;
  }

  return (
    <AccountSelectStyled>
      <ParagraphXS>Select account to connect</ParagraphXS>
      {getContent()}
    </AccountSelectStyled>
  );
};
