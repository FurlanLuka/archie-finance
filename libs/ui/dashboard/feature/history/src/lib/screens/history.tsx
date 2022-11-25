import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { Transaction } from '@archie/api/credit-api/data-transfer-objects/types';
import { TransactionsTable } from '@archie/ui/dashboard/components';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetTransactions } from '@archie/ui/shared/data-access/archie-api/payment/hooks/use-get-transactions';
import { ButtonOutline } from '@archie/ui/shared/design-system';
import {
  Card,
  Skeleton,
  TitleM,
  TitleS,
} from '@archie/ui/shared/design-system';

import { Statements } from '../components/statements/statements';

import { HistoryStyled } from './history.styled';

export const HistoryScreen: FC = () => {
  const { t } = useTranslation();

  const getTransactionsResponse = useGetTransactions();

  const data: Transaction[] = useMemo(() => {
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
      return (
        <Card height="450px">
          <Skeleton />
        </Card>
      );
    }

    if (getTransactionsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/history' }} />;
    }

    if (getTransactionsResponse.state === RequestState.SUCCESS) {
      return (
        <Card column alignItems="flex-start" padding="1.5rem 1.5rem 2rem">
          <div className="subtitle-group">
            <TitleS>{t('dashboard_history.subtitle')}</TitleS>
            <Statements />
          </div>
          <TransactionsTable data={data} />
          {getTransactionsResponse.hasNextPage && (
            <ButtonOutline
              small
              className="load-btn"
              onClick={getTransactionsResponse.fetchNextPage}
            >
              {t('dashboard_history.btn_load_more')}
            </ButtonOutline>
          )}
        </Card>
      );
    }

    if (getTransactionsResponse.state === RequestState.LOADING_NEXT_PAGE) {
      return (
        <Card column alignItems="flex-start" padding="1.5rem 1.5rem 2rem">
          <div className="subtitle-group">
            <TitleS>{t('dashboard_history.subtitle')}</TitleS>
            <Statements />
          </div>
          <TransactionsTable data={data} />
          <ButtonOutline small isLoading className="load-btn">
            {t('dashboard_history.btn_load_more')}
          </ButtonOutline>
        </Card>
      );
    }

    return null;
  };

  return (
    <HistoryStyled>
      <TitleM className="title">{t('dashboard_history.title')}</TitleM>
      {getContent()}
    </HistoryStyled>
  );
};
