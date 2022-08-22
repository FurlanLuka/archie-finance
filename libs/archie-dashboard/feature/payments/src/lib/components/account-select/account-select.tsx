import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { useConnectAccount } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-connect-account';
import { useGetLinkableAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-linkable-accounts';
import {
  ButtonPrimary,
  Loader,
  ParagraphM,
  ParagraphXS,
  Select,
  SelectOption,
} from '@archie-webapps/shared/ui/design-system';

import { AccountItem } from '../account-item/account-item';

import { AccountSelectStyled } from './account-select.styled';

interface AccountSelectProps {
  itemId: string;
  onConnect?: VoidFunction;
}

export const AccountSelect: FC<AccountSelectProps> = ({ itemId, onConnect }) => {
  const { t } = useTranslation();
  const getLinkableAccountsResponse = useGetLinkableAccounts(itemId);
  const connectAccountMutation = useConnectAccount();

  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);

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

  const getContent = () => {
    if (getLinkableAccountsResponse.state === RequestState.LOADING) {
      return <Loader className="loader" />;
    }

    if (getLinkableAccountsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
    }

    if (getLinkableAccountsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <ParagraphM weight={800} className="modal-title">
            {t('dashboard_payment.account_select.label')}
          </ParagraphM>
          <div className="modal-select">
            <Select id="accounts" header={header} onChange={(account: AccountResponse) => setSelectedAccount(account)}>
              {options}
            </Select>
          </div>
          <ButtonPrimary
            onClick={handleConfirmClick}
            maxWidth="fit-content"
            disabled={!selectedAccount}
            isLoading={connectAccountMutation.state === RequestState.LOADING}
          >
            {t('dashboard_payment.account_select.btn_connect')}
          </ButtonPrimary>
        </>
      );
    }

    return <></>;
  };

  return <AccountSelectStyled>{getContent()}</AccountSelectStyled>;
};
