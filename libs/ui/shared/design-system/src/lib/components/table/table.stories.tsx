import { Story } from '@ladle/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { tableColumns } from '../../utils/table-fixtures/table-columns';
import { tableData } from '../../utils/table-fixtures/table-data';

import { TableProps, Table } from './table';

export default {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
};

export const Default: Story<TableProps> = () => (
  <StoriesContainer>
    <StoriesTitle title="Table" />
    <div style={{ maxWidth: '60%' }}>
      <Table columns={tableColumns} data={tableData} />
    </div>
  </StoriesContainer>
);
