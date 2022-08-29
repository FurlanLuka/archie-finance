import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { TransactionsTable } from '@archie-webapps/archie-dashboard/components';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetTransactions } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-transactions';
import { ButtonOutline } from '@archie-webapps/shared/ui/design-system';
import { Card, Loader, ParagraphM } from '@archie-webapps/shared/ui/design-system';

import { HistoryStyled } from './history.styled';

export const HistoryScreen: FC = () => {
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
      return <Loader />;
    }

    if (getTransactionsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/history' }} />;
    }

    if (getTransactionsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <ParagraphM weight={800} className="title">
            {t('dashboard_history.title')}
          </ParagraphM>
          <TransactionsTable data={data} />
          {getTransactionsResponse.hasNextPage && (
            <ButtonOutline small className="load-btn" onClick={getTransactionsResponse.fetchNextPage}>
              {t('dashboard_history.btn_load_more')}
            </ButtonOutline>
          )}
        </>
      );
    }

    if (getTransactionsResponse.state === RequestState.LOADING_NEXT_PAGE) {
      return (
        <>
          <ParagraphM weight={800} className="title">
            {t('dashboard_history.title')}
          </ParagraphM>
          <TransactionsTable data={data} />
          <ButtonOutline small isLoading className="load-btn">
            {t('dashboard_history.btn_load_more')}
          </ButtonOutline>
        </>
      );
    }

    return null;
  };

  return (
    <HistoryStyled>
      <Card column alignItems="center" justifyContent="center" padding="2rem 1.5rem 2.5rem" minHeight="450px">
        {getContent()}
      </Card>
    </HistoryStyled>
  );
};
