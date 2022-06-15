import { FC } from 'react';
import { Status } from '../../../constants/transactions-status';
import { StatusCellStyled, DescriptionCellStyled } from './table-fixtures.styled';

interface StatusCellProps {
  status: Status;
}

const StatusCell: FC<StatusCellProps> = ({ status }) => <StatusCellStyled status={status}>{status}</StatusCellStyled>;

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

export const tableColumns = [
  {
    Header: '',
    id: 'hidden',
    columns: [
      {
        Header: 'Date',
        accessor: 'date',
        width: 1,
      },
      {
        Header: 'Description',
        accessor: 'description',
        width: 2,
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
        accessor: 'amount',
        width: 1,
      },
    ],
  },
];
