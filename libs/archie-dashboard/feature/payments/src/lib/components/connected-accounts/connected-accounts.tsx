import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Card, Skeleton, Modal, ParagraphM, ParagraphXS, ButtonOutline } from '@archie-webapps/shared/ui/design-system';

import { ConnectAccount } from '../connect-account/connect-acount';

import { ConnectedAccount } from './blocks/connected-account';
import { ConnectedAccountsStyled } from './connected-accounts.styled';

export const ConnectedAccounts: FC = () => {
  const { t } = useTranslation();
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  if (getConnectedAccountsResponse.state === RequestState.LOADING) {
    return (
      <Card minHeight="220px">
        <Skeleton />
      </Card>
    );
  }

  if (getConnectedAccountsResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
  }

  if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
    const getAccountsList = () => {
      if (getConnectedAccountsResponse.data.length === 0) {
        return <ParagraphXS>{t('dashboard_payment.connected_accounts.no_accounts')}</ParagraphXS>;
      }

      return getConnectedAccountsResponse.data.map((account) => (
        <ConnectedAccount key={account.id} account={account} />
      ));
    };

    return (
      <ConnectedAccountsStyled>
        <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
          <ParagraphM weight={800} className="title">
            {t('dashboard_payment.connected_accounts.title')}
          </ParagraphM>
          <div className="account-list">{getAccountsList()}</div>
          <ButtonOutline small maxWidth="fit-content" onClick={() => setIsAddAccountModalOpen(true)}>
            {t('dashboard_payment.connected_accounts.btn_add')}
          </ButtonOutline>
        </Card>
        {isAddAccountModalOpen && (
          <Modal maxWidth="760px" isOpen close={() => setIsAddAccountModalOpen(false)}>
            <ConnectAccount onAccountConnect={() => setIsAddAccountModalOpen(false)} />
          </Modal>
        )}
      </ConnectedAccountsStyled>
    );
  }

  return <></>;
};
