import { format } from 'date-fns';
import { FC, PropsWithChildren } from 'react';
import { Column } from 'react-table';

import {
  NetAsset,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@archie/api/credit-api/data-transfer-objects/types';
import {
  TransactionStatusColor,
  TransactionStatusText,
  TransactionTypeText,
} from '@archie/ui/dashboard/constants';
import { BodyL, BodyM, BodyS } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { getRowDescription } from './table-fixtures.helpers';

interface DateCellProps {
  date: string;
}

const DateCell: FC<DateCellProps> = ({ date }) => (
  <BodyM weight={500}>{format(new Date(date), 'M/d')}</BodyM>
);

interface DescriptionCellProps {
  title: string;
  code: string;
}

const DescriptionCell: FC<DescriptionCellProps> = ({ title, code }) => (
  <>
    <BodyL weight={500}>{title}</BodyL>
    <BodyS color={theme.textSecondary} weight={500}>
      {code}
    </BodyS>
  </>
);

interface TypeCellProps extends PropsWithChildren {
  type: TransactionType;
}

const TypeCell: FC<TypeCellProps> = ({ type }) => (
  <BodyM weight={500}>{TransactionTypeText[type]}</BodyM>
);

interface StatusCellProps extends PropsWithChildren {
  status: TransactionStatus;
}

const StatusCell: FC<StatusCellProps> = ({ status }) => (
  <BodyM color={TransactionStatusColor[status]} weight={500}>
    {TransactionStatusText[status]}
  </BodyM>
);

interface AmountCellProps {
  amount: number;
}

const AmountCell: FC<AmountCellProps> = ({ amount }) => {
  const isPositive = amount > 0;

  return (
    <BodyM
      color={isPositive ? theme.textSuccess : theme.textDanger}
      weight={500}
    >
      {isPositive ? '+' : '-'}${Math.abs(amount)}
    </BodyM>
  );
};

export const tableColumns: Column<Transaction>[] = [
  {
    Header: '',
    id: 'hidden',
    columns: [
      {
        Header: 'Date',
        accessor: 'created_at',
        Cell: ({ value }: any) => {
          return <DateCell date={value} />;
        },
      },
      {
        Header: 'Description',
        width: 2,
        accessor: (row) => getRowDescription(row),
        Cell: ({ value: { title, code } }: any) => {
          return <DescriptionCell title={title} code={code} />;
        },
      },
      {
        Header: 'Type',
        accessor: 'type',
        width: 1,
        Cell: ({ value }: any) => {
          return <TypeCell type={value}>{value}</TypeCell>;
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
        accessor: (row) =>
          row.net_asset === NetAsset.negative
            ? -row.us_dollar_amount
            : row.us_dollar_amount,
        width: 1,
        Cell: ({ value }: any) => {
          return <AmountCell amount={value} />;
        },
      },
    ],
  },
];
