import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { TransactionsTable } from '@archie-webapps/archie-dashboard/components';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetTransactions } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-transactions';
import { ButtonOutline, LoaderFullScreen } from '@archie-webapps/shared/ui/design-system';

import { RecentTransactionsStyled } from './recent-transactions.styled';

export const RecentTransactions: FC = () => {
  const { t } = useTranslation();

  const getTransactionsResponse = useGetTransactions();

  const data = useMemo(() => {
    if (
      getTransactionsResponse.state === RequestState.SUCCESS ||
      getTransactionsResponse.state === RequestState.LOADING_NEXT_PAGE
    ) {
      return getTransactionsResponse.pages.flatMap((page) => page.data);
    }

    return [];
  }, [getTransactionsResponse]);

  const getContent = () => {
    if (getTransactionsResponse.state === RequestState.LOADING) {
      return <LoaderFullScreen />;
    }

    if (getTransactionsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/history' }} />;
    }

    if (getTransactionsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <TransactionsTable data={data} />
          {getTransactionsResponse.hasNextPage && (
            <ButtonOutline
              small
              maxWidth="fit-content"
              className="load-btn"
              onClick={getTransactionsResponse.fetchNextPage}
            >
              {t('dashboard_history.btn_load_more')}
            </ButtonOutline>
          )}
        </>
      );
    }

    if (getTransactionsResponse.state === RequestState.LOADING_NEXT_PAGE) {
      return (
        <>
          <TransactionsTable data={data} />
          <ButtonOutline small maxWidth="fit-content" isLoading className="load-btn">
            {t('dashboard_history.btn_load_more')}
          </ButtonOutline>
        </>
      );
    }

    return null;
  };

  return <RecentTransactionsStyled>{getContent()}</RecentTransactionsStyled>;
};
