import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { useConnectAccount } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-connect-account';
import { useGetLinkableAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-linkable-accounts';
import { ButtonPrimary, Loader, ParagraphXS, Select, SelectOption } from '@archie-webapps/shared/ui/design-system';

import { AccountItem } from '../account-item/account-item';

import { AccountSelectStyled } from './account-select.styled';

interface AccountSelectProps {
  itemId: string;
  onConnect?: VoidFunction;
}

export const AccountSelect: FC<AccountSelectProps> = ({ itemId, onConnect }) => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);

  const getLinkableAccountsResponse = useGetLinkableAccounts(itemId);
  const connectAccountMutation = useConnectAccount();

  useEffect(() => {
    if (connectAccountMutation.state === RequestState.SUCCESS) {
      onConnect?.();
    }
  }, [connectAccountMutation, onConnect]);

  const handleConfirmClick = () => {
    if (!selectedAccount) {
      return;
    }
    if (connectAccountMutation.state === RequestState.IDLE) {
      connectAccountMutation.mutate({
        itemId,
        accountId: selectedAccount.id,
      });
    }
  };

  const handleSelect = (account: AccountResponse) => {
    setSelectedAccount(account);
  };

  const header = selectedAccount ? (
    <AccountItem account={selectedAccount} />
  ) : (
    <ParagraphXS weight={700}>{t('dashboard_payment.account_select.empty')}</ParagraphXS>
  );

  const options = useMemo(() => {
    if (getLinkableAccountsResponse.state === RequestState.SUCCESS) {
      return getLinkableAccountsResponse.data.map((account) => (
        <SelectOption key={account.id} value={account}>
          <AccountItem account={account} />
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
            {t('dashboard_payment.account_select.btn_connect')}
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
            {t('dashboard_payment.account_select.btn_connect')}
          </ButtonPrimary>
        </>
      );
    }

    return <></>;
  }

  return (
    <AccountSelectStyled>
      <ParagraphXS>{t('dashboard_payment.account_select.label')}</ParagraphXS>
      {getContent()}
    </AccountSelectStyled>
  );
};
