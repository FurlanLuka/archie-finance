import { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { transactionColumns } from '@archie-webapps/archie-dashboard/components';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetRecentTransactions } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-recent-transactions';
import { ButtonOutline, Card, Loader, ParagraphM, Table } from '@archie-webapps/shared/ui/design-system';

import { RecentTransactionsStyled } from './recent-transactions.styled';

export const RecentTransactions: FC = () => {
  const getRecentTransactionsResponse = useGetRecentTransactions();

  const columns = useMemo(() => transactionColumns, []);
  const data = useMemo(() => {
    if (getRecentTransactionsResponse.state === RequestState.SUCCESS) {
      return getRecentTransactionsResponse.data;
    }

    return [];
  }, [getRecentTransactionsResponse]);

  function getContent() {
    if (getRecentTransactionsResponse.state === RequestState.LOADING) {
      return <Loader />;
    }

    if (getRecentTransactionsResponse.state === RequestState.SUCCESS) {
      return <Table columns={columns} data={data} />;
    }

    return null;
  }

  return (
    <RecentTransactionsStyled>
      <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
        <ParagraphM weight={800} className="table-title">
          Recent Transactions
        </ParagraphM>
        <Link to="/history" className="history-link">
          <ButtonOutline small className="table-btn">
            View More
          </ButtonOutline>
        </Link>
        {getContent()}
      </Card>
    </RecentTransactionsStyled>
  );
};
