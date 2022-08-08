import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { transactionColumns } from '@archie-webapps/archie-dashboard/components';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetTransactions } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-transactions';
import { ButtonOutline, Loading, Table } from '@archie-webapps/shared/ui/design-system';

import { TransactionsTableStyled } from './transactions-table.styled';

export const TransactionsTable: FC = () => {
  const { t } = useTranslation();
  const getTransactionsResponse = useGetTransactions();
  const columns = useMemo(() => transactionColumns, []);

  const data = useMemo(() => {
    if (
      getTransactionsResponse.state === RequestState.SUCCESS ||
      getTransactionsResponse.state === RequestState.LOADING_NEXT_PAGE
    ) {
      return getTransactionsResponse.pages.flatMap((page) => {
        return page.data;
      });
    }

    return [];
  }, [getTransactionsResponse]);

  function getContent() {
    if (getTransactionsResponse.state === RequestState.LOADING) {
      return <Loading />;
    }

    if (getTransactionsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <Table data={data} columns={columns} />
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
          <Table data={data} columns={columns} />
          <ButtonOutline small maxWidth="fit-content" isLoading className="load-btn">
            {t('dashboard_history.btn_load_more')}
          </ButtonOutline>
        </>
      );
    }

    return null;
  }

  return <TransactionsTableStyled>{getContent()}</TransactionsTableStyled>;
};
