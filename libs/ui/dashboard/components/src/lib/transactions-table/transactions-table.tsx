import { FC, useMemo } from 'react';

import { Table } from '@archie-microservices/ui/shared/ui/design-system';

import { tableColumns } from './fixtures/table-fixtures';

export interface TransactionsTableProps {
  data: Record<string, any>[];
}

export const TransactionsTable: FC<TransactionsTableProps> = ({ data }) => {
  const columns = useMemo(() => tableColumns, []);

  return <Table data={data} columns={columns} />;
};
