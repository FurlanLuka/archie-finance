import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { TableProps, Table } from './table';

export default {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

const tableColumns = [
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
          return (
            <div>
              <p>{title}</p>
              <p>{code}</p>
            </div>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: 1,
        Cell: ({ value }: any) => {
          return <div style={{ color: 'green' }}>{value}</div>;
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

const tableData = [
  {
    date: 'Yesterday',
    description: {
      title: 'Merchant Name',
      code: 'Merchant code',
    },
    status: 'pending',
    amount: '$22.31',
  },
  {
    date: '5/3',
    description: {
      title: 'SquareSpace',
      code: 'Merchant code',
    },
    status: 'completed',
    amount: '$16.00',
  },
  {
    date: '5/2',
    description: {
      title: 'TST*TST Annie Baileys Lancaster',
      code: 'Merchant code',
    },
    status: 'completed',
    amount: '$118.01',
  },
  {
    date: '5/1',
    description: {
      title: 'TST* Zoetropolis Cinema Lancaster PA',
      code: 'Merchant code',
    },
    status: 'completed',
    amount: '$22.31',
  },
  {
    date: '4/30',
    description: {
      title: 'Sunoco 0363427601',
      code: 'Merchant code',
    },
    status: 'completed',
    amount: '$104.28',
  },
];

export const Default: Story<TableProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Table" />
    <div style={{ maxWidth: '60%' }}>
      <Table {...props} />
    </div>
  </StoriesContainer>
);

Default.args = {
  columns: tableColumns,
  data: tableData,
};
