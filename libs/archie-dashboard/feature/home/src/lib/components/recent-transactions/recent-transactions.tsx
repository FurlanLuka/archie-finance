import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { TransactionsTable } from '@archie-webapps/archie-dashboard/components';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetRecentTransactions } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-recent-transactions';
import { ButtonOutline, Card, ParagraphM } from '@archie-webapps/shared/ui/design-system';

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
        <div className="skeleton"></div>
      </Card>
    );
  }

  if (getRecentTransactionsResponse.state === RequestState.ERROR) {
    return <div>Something went wrong :(</div>; // TODO: replace with error state
  }

  if (getRecentTransactionsResponse.state === RequestState.SUCCESS) {
    return (
      <RecentTransactionsStyled>
        <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
          <ParagraphM weight={800} className="title">
            {t('dashboard_home.recent_transactions.title')}
          </ParagraphM>
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
