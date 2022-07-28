import { FC } from 'react';
import { Column } from 'react-table';

import { TransactionStatusColor, TransactionStatusText } from '@archie-webapps/archie-dashboard/constants';
import {
  Transaction,
  TransactionStatus,
} from '@archie-webapps/shared/data-access/archie-api/payment/api/get-transactions';

import { StatusCellStyled, DescriptionCellStyled } from './table-fixtures.styled';

interface StatusCellProps {
  status: TransactionStatus;
}

const StatusCell: FC<StatusCellProps> = ({ status }) => (
  <StatusCellStyled color={TransactionStatusColor[status]}>{TransactionStatusText[status]}</StatusCellStyled>
);

interface DescriptionCellProps {
  title: string;
  code: string;
}

const DescriptionCell: FC<DescriptionCellProps> = ({ title, code }) => (
  <DescriptionCellStyled>
    <div className="description-title">{title}</div>
    <div className="description-code">{code}</div>
  </DescriptionCellStyled>
);

export const tableColumns: Column<Transaction>[] = [
  {
    Header: '',
    id: 'hidden',
    columns: [
      {
        Header: 'Date',
        accessor: 'created_at',
        width: 1,
      },
      {
        Header: 'Description',
        width: 2,
        accessor: (row) => ({
          title: row.merchant_name,
          code: row.merchant_number,
        }),
        Cell: ({ value: { title, code } }: any) => {
          return <DescriptionCell title={title} code={code} />;
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: 1,
        Cell: ({ value }: any) => {
          return <StatusCell status={value}>{value}</StatusCell>;
        },
      },
      {
        Header: 'Amount',
        accessor: 'us_dollar_amount',
        width: 1,
      },
    ],
  },
];
