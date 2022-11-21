import { FC, useMemo } from 'react';

import { Transaction } from '@archie/api/credit-api/data-transfer-objects/types';
import { Table } from '@archie/ui/shared/design-system';

import { tableColumns } from './fixtures/table-fixtures';

export interface TransactionsTableProps {
  data: Transaction[];
}

export const TransactionsTable: FC<TransactionsTableProps> = ({ data }) => {
  const columns = useMemo(() => tableColumns, []);

  return <Table data={data} columns={columns} />;
};
