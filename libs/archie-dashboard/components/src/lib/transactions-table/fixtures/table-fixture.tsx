import { format } from 'date-fns';
import { FC } from 'react';
import { Column } from 'react-table';

import {
  TransactionStatusColor,
  TransactionStatusText,
  TransactionTypeText,
} from '@archie-webapps/archie-dashboard/constants';
import {
  NetAsset,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@archie-webapps/shared/data-access/archie-api/payment/api/get-transactions';
import { ParagraphS, ParagraphXS, ParagraphXXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { getRowDescription } from './table-fixture.helpers';

interface DateCellProps {
  date: string;
}

const DateCell: FC<DateCellProps> = ({ date }) => (
  <ParagraphXS weight={500}>{format(new Date(date), 'M/d')}</ParagraphXS>
);

interface DescriptionCellProps {
  title: string;
  code: string;
}

const DescriptionCell: FC<DescriptionCellProps> = ({ title, code }) => (
  <>
    <ParagraphS weight={500}>{title}</ParagraphS>
    <ParagraphXXS color={theme.textSecondary} weight={500}>
      {code}
    </ParagraphXXS>
  </>
);

interface TypeCellProps {
  type: TransactionType;
}

const TypeCell: FC<TypeCellProps> = ({ type }) => <ParagraphXS weight={500}>{TransactionTypeText[type]}</ParagraphXS>;
interface StatusCellProps {
  status: TransactionStatus;
}

const StatusCell: FC<StatusCellProps> = ({ status }) => (
  <ParagraphXS color={TransactionStatusColor[status]} weight={500}>
    {TransactionStatusText[status]}
  </ParagraphXS>
);

interface AmountCellProps {
  amount: number;
}

const AmountCell: FC<AmountCellProps> = ({ amount }) => {
  const isPositive = amount > 0;

  return (
    <ParagraphXS color={isPositive ? theme.textSuccess : theme.textDanger} weight={500}>
      {isPositive ? '-' : '+'}${Math.abs(amount)}
    </ParagraphXS>
  );

  // return amount < 0 ? <ParagraphXS>{`- $${-amount}`}</ParagraphXS> : <ParagraphXS>{`+ $${amount}`}</ParagraphXS>;
};

export const transactionColumns: Column<Transaction>[] = [
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
        accessor: (row) => (row.net_asset === NetAsset.NEGATIVE ? -row.us_dollar_amount : row.us_dollar_amount),
        width: 1,
        Cell: ({ value }: any) => {
          return <AmountCell amount={value} />;
        },
      },
    ],
  },
];
