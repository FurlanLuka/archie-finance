import { FC, useMemo } from 'react';

import { transactionColumns } from '@archie-webapps/archie-dashboard/components';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetTransactions } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-transactions';
import { ButtonOutline, Table } from '@archie-webapps/shared/ui/design-system';

export const TransactionsTable: FC = () => {
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
      return <div>Loading..</div>;
    }

    if (getTransactionsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <Table data={data} columns={columns} />
          {getTransactionsResponse.hasNextPage && (
            <ButtonOutline small onClick={getTransactionsResponse.fetchNextPage}>
              Load more!
            </ButtonOutline>
          )}
        </>
      );
    }

    if (getTransactionsResponse.state === RequestState.LOADING_NEXT_PAGE) {
      return (
        <>
          <Table data={data} columns={columns} />
          <ButtonOutline small disabled>
            Loading
          </ButtonOutline>
        </>
      );
    }

    return null;
  }

  return <div>{getContent()}</div>;
};
