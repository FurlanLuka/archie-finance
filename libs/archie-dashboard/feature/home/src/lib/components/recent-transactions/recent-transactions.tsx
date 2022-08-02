import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonOutline, Card, ParagraphM, Table } from '@archie-webapps/shared/ui/design-system';

import { tableData } from '../../constants/table-data';
import { tableColumns } from '../../fixtures/table-fixture';

import { RecentTransactionsStyled } from './recent-transactions.styled';

export const RecentTransactions: FC = () => {
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => tableData, []);

  return (
    <RecentTransactionsStyled>
      <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
        <ParagraphM weight={800} className="table-title">
          Recent Transactions
        </ParagraphM>
        <div className="btn-group">
          <ButtonOutline maxWidth="auto" small className="table-btn">
            View More
          </ButtonOutline>
        </div>
        <Table columns={columns} data={data} />
      </Card>
    </RecentTransactionsStyled>
  );
};
