import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';

import { TransactionsTable } from '@archie-webapps/archie-dashboard/components';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetRecentTransactions } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-recent-transactions';
import { ButtonOutline, Card, Skeleton, TitleS } from '@archie-webapps/shared/ui/design-system';

import { RecentTransactionsStyled } from './recent-transactions.styled';

export const RecentTransactions: FC = () => {
  const { t } = useTranslation();

  const getRecentTransactionsResponse = useGetRecentTransactions();

  const data = useMemo(() => {
    if (getRecentTransactionsResponse.state === RequestState.SUCCESS) {
      return getRecentTransactionsResponse.data;
    }

    return [];
  }, [getRecentTransactionsResponse]);

  if (getRecentTransactionsResponse.state === RequestState.LOADING) {
    return (
      <Card minHeight="450px">
        <Skeleton />
      </Card>
    );
  }

  if (getRecentTransactionsResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/home' }} />;
  }

  if (getRecentTransactionsResponse.state === RequestState.SUCCESS) {
    return (
      <RecentTransactionsStyled>
        <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem" minHeight="450px">
          <TitleS className="title">{t('dashboard_home.recent_transactions.title')}</TitleS>
          <Link to="/history" className="history-link">
            <ButtonOutline small className="btn">
              {t('dashboard_home.recent_transactions.btn')}
            </ButtonOutline>
          </Link>
          <TransactionsTable data={data} />
        </Card>
      </RecentTransactionsStyled>
    );
  }

  return <></>;
};
