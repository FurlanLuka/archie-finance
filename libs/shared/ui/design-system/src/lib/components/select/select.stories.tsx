import { Story, Meta } from '@storybook/react';
import { useState } from 'react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { ParagraphXS } from '../typography/typography.styled';

import { Select } from './select';

export default {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
} as Meta;

const selectOptions = ['Custom item 1', 'Custom item 2', 'Custom item 3'];

export const Default: Story = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const header = selectedItem ? (
    <ParagraphXS>{selectedItem}</ParagraphXS>
  ) : (
    <ParagraphXS weight={700}>Please select an item</ParagraphXS>
  );

  const options = selectOptions.map((item, index) => (
    <div style={{ padding: '0.5rem 1rem' }}>
      <ParagraphXS weight={500} key={index}>
        {item}
      </ParagraphXS>
    </div>
  ));

  return (
    <StoriesContainer>
      <StoriesTitle title="Select" />
      <div style={{ maxWidth: '30%' }}>
        <Select id="select" header={header} onChange={(item: string) => setSelectedItem(item)}>
          {options}
        </Select>
      </div>
    </StoriesContainer>
  );
};
