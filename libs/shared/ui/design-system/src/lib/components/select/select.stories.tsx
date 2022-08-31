import { Story, Meta } from '@storybook/react';
import { useState } from 'react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { BodyM } from '../typography/typography.styled';

import { Select } from './select';
import { SelectOption } from './select-option';

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

  const header = selectedItem ? <BodyM>{selectedItem}</BodyM> : <BodyM weight={700}>Please select an item</BodyM>;

  const options = selectOptions.map((item, index) => (
    <SelectOption key={index} value={item}>
      <BodyM weight={500}>{item}</BodyM>
    </SelectOption>
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
