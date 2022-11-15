import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { FC, PropsWithChildren } from 'react';

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

type TypeCellProps = PropsWithChildren<{
  type: TransactionType;
}>;

const TypeCell: FC<TypeCellProps> = ({ type }) => (
  <BodyM weight={500}>{TransactionTypeText[type]}</BodyM>
);

type StatusCellProps = PropsWithChildren<{
  status: TransactionStatus;
}>;

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

const columnHelper = createColumnHelper<Transaction>();

export const tableColumns: ColumnDef<Transaction, any>[] = [
  columnHelper.accessor('created_at', {
    header: 'Date',
    cell: ({ getValue }) => {
      return <DateCell date={getValue()} />;
    },
  }),
  columnHelper.accessor((row) => getRowDescription(row), {
    header: 'Description',
    cell: ({ getValue }) => {
      const { title, code } = getValue();

      return <DescriptionCell title={title} code={code} />;
    },
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: ({ getValue }) => {
      const value = getValue();

      return <TypeCell type={value}>{value}</TypeCell>;
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue();

      return <StatusCell status={value}>{value}</StatusCell>;
    },
  }),
  columnHelper.accessor(
    (row) =>
      row.net_asset === NetAsset.negative
        ? -row.us_dollar_amount
        : row.us_dollar_amount,
    {
      header: 'Amount',
      cell: ({ getValue }) => {
        return <AmountCell amount={getValue()} />;
      },
    },
  ),
];
