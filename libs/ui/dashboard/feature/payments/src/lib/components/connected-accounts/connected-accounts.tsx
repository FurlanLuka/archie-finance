import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { ConnectAccountModal } from '@archie/ui/dashboard/feature/make-payment';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie/ui/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import {
  Card,
  Skeleton,
  ButtonOutline,
  TitleS,
  BodyM,
} from '@archie/ui/shared/design-system';

import { ConnectedAccount } from './blocks/connected-account';
import { ConnectedAccountsStyled } from './connected-accounts.styled';
import { theme } from '@archie/ui/shared/theme';

export const ConnectedAccounts: FC = () => {
  const { t } = useTranslation();
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  const [connectedAccountModalOpen, setConnectedAccountModalOpen] =
    useState(false);

  if (getConnectedAccountsResponse.state === RequestState.LOADING) {
    return (
      <Card minHeight="200px">
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
        return (
          <BodyM color={theme.textSecondary} weight={500}>
            {t('dashboard_payment.connected_accounts.no_accounts')}
          </BodyM>
        );
      }

      return getConnectedAccountsResponse.data.map((account) => (
        <ConnectedAccount key={account.id} account={account} />
      ));
    };

    return (
      <ConnectedAccountsStyled>
        <Card
          column
          alignItems="flex-start"
          padding="1.5rem 1.5rem 2rem"
          minHeight="200px"
        >
          <TitleS className="accounts-title">
            {t('dashboard_payment.connected_accounts.title')}
          </TitleS>
          <div className="accounts-list">{getAccountsList()}</div>
          <ButtonOutline
            small
            onClick={() => setConnectedAccountModalOpen(true)}
          >
            {t('dashboard_payment.connected_accounts.btn_add')}
          </ButtonOutline>
        </Card>
        {connectedAccountModalOpen && (
          <ConnectAccountModal
            close={() => setConnectedAccountModalOpen(false)}
          />
        )}
      </ConnectedAccountsStyled>
    );
  }

  return <></>;
};
