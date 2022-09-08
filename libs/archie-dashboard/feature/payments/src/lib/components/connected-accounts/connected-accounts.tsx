import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { ConnectAccountModal } from '@archie-webapps/archie-dashboard/feature/make-payment';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Card, Skeleton, ButtonOutline, TitleS, BodyM } from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccount } from './blocks/connected-account';
import { ConnectedAccountsStyled } from './connected-accounts.styled';

export const ConnectedAccounts: FC = () => {
  const { t } = useTranslation();
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  const [connectedAccounttModalOpen, setConnectedAccounttModalOpen] = useState(false);

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
        return <BodyM>{t('dashboard_payment.connected_accounts.no_accounts')}</BodyM>;
      }

      return getConnectedAccountsResponse.data.map((account) => (
        <ConnectedAccount key={account.id} account={account} />
      ));
    };

    return (
      <ConnectedAccountsStyled>
        <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
          <TitleS className="title">{t('dashboard_payment.connected_accounts.title')}</TitleS>
          <div className="account-list">{getAccountsList()}</div>
          <ButtonOutline small onClick={() => setConnectedAccounttModalOpen(true)}>
            {t('dashboard_payment.connected_accounts.btn_add')}
          </ButtonOutline>
        </Card>
        {connectedAccounttModalOpen && <ConnectAccountModal close={() => setConnectedAccounttModalOpen(false)} />}
      </ConnectedAccountsStyled>
    );
  }

  return <></>;
};
