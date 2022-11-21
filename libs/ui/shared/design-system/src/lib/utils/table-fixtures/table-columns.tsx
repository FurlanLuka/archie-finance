import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { TableDataEntry } from './table-data';

const columnHelper = createColumnHelper<TableDataEntry>();

export const tableColumns: ColumnDef<TableDataEntry, any>[] = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: ({ renderValue }) => renderValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ getValue }) => {
      const { title, code } = getValue();

      return (
        <div>
          <p>{title}</p>
          <p>{code}</p>
        </div>
      );
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue();

      return (
        <div style={{ color: value === 'pending' ? 'grey' : 'green' }}>
          {getValue()}
        </div>
      );
    },
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ renderValue }) => renderValue(),
  }),
];
