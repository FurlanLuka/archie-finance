import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import {
  ButtonPrimary,
  Loader,
  ParagraphM,
  ParagraphXS,
  Select,
  SelectOption,
} from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccountItem } from '../connected-account-item/connected-account-item';

import { ChooseAccountStyled } from './choose-account.styled';

interface ChooseAccountProps {
  onConfirm: (account: AccountResponse) => void;
}

export const ChooseAccount: FC<ChooseAccountProps> = ({ onConfirm }) => {
  const { t } = useTranslation();
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);

  const handleConfirmClick = () => {
    if (!selectedAccount) {
      return;
    }

    onConfirm(selectedAccount);
  };

  const header = selectedAccount ? (
    <ConnectedAccountItem account={selectedAccount} />
  ) : (
    <ParagraphXS weight={700}>{t('payment_modal.select_account.empty')}</ParagraphXS>
  );

  const options = useMemo(() => {
    if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
      return getConnectedAccountsResponse.data.map((account) => (
        <SelectOption key={account.id} value={account}>
          <ConnectedAccountItem account={account} />
        </SelectOption>
      ));
    }
    return [];
  }, [getConnectedAccountsResponse]);

  const getContent = () => {
    if (getConnectedAccountsResponse.state === RequestState.LOADING) {
      return <Loader className="loader" />;
    }

    if (getConnectedAccountsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
    }

    if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <ParagraphM weight={800} className="modal-title">
            {t('payment_modal.select_account.label')}
          </ParagraphM>
          <div className="modal-select">
            <Select id="accounts" header={header} onChange={(account: AccountResponse) => setSelectedAccount(account)}>
              {options}
            </Select>
          </div>
          <ButtonPrimary onClick={handleConfirmClick} maxWidth="fit-content" disabled={!selectedAccount}>
            {t('payment_modal.select_account.btn_confirm')}
          </ButtonPrimary>
        </>
      );
    }

    return <></>;
  };

  return <ChooseAccountStyled>{getContent()}</ChooseAccountStyled>;
};
