import { FC } from 'react';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetRecentTransactions } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-recent-transactions';
import { ButtonOutline, Card, Loader, ParagraphM, Table } from '@archie-webapps/shared/ui/design-system';

import { tableColumns } from './fixtures/table-fixture';
import { RecentTransactionsStyled } from './recent-transactions.styled';

export const RecentTransactions: FC = () => {
  const getRecentTransactionsResponse = useGetRecentTransactions();

  function getContent() {
    if (getRecentTransactionsResponse.state === RequestState.LOADING) {
      return <Loader />;
    }

    if (getRecentTransactionsResponse.state === RequestState.ERROR) {
      return null;
    }

    if (getRecentTransactionsResponse.state === RequestState.SUCCESS) {
      return <Table columns={tableColumns} data={getRecentTransactionsResponse.data as any} />;
    }

    return null;
  }

  return (
    <RecentTransactionsStyled>
      <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
        <ParagraphM weight={800} className="table-title">
          Recent Transactions
        </ParagraphM>
        <ButtonOutline maxWidth="auto" small className="table-btn">
          View More
        </ButtonOutline>
        {getContent()}
      </Card>
    </RecentTransactionsStyled>
  );
};
