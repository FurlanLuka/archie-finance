import { Story, Meta } from '@storybook/react';
import { useState } from 'react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { BodyM, BodyS } from '../typography/typography.styled';

import { Select } from './select';
import { SelectStyledProps } from './select.styled';
import { SelectOption } from './select-option';

export default {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

const selectOptions = ['Custom item 1', 'Custom item 2', 'Custom item 3'];

export const Default: Story<SelectStyledProps> = (props) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const header = selectedItem ? <BodyM>{selectedItem}</BodyM> : <BodyM weight={600}>Please select an item</BodyM>;

  const options = selectOptions.map((item, index) => (
    <SelectOption key={index} value={item}>
      <BodyM weight={500}>{item}</BodyM>
    </SelectOption>
  ));

  return (
    <StoriesContainer>
      <StoriesTitle title="Select" />
      <div style={{ maxWidth: '30%' }}>
        <Select {...props} id="select" header={header} onChange={(item: string) => setSelectedItem(item)}>
          {options}
        </Select>
      </div>
    </StoriesContainer>
  );
};

Default.args = {
  isLoading: false,
  isDisabled: false,
  maxWidth: '',
  small: false,
};

export const Small: Story<SelectStyledProps> = (props) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const header = selectedItem ? <BodyS>{selectedItem}</BodyS> : <BodyS weight={600}>Please select an item</BodyS>;

  const options = selectOptions.map((item, index) => (
    <SelectOption key={index} value={item}>
      <BodyM weight={500}>{item}</BodyM>
    </SelectOption>
  ));

  return (
    <StoriesContainer>
      <StoriesTitle title="Select" />
      <div style={{ maxWidth: '30%' }}>
        <Select {...props} id="select" header={header} onChange={(item: string) => setSelectedItem(item)}>
          {options}
        </Select>
      </div>
    </StoriesContainer>
  );
};

Small.args = {
  isLoading: false,
  isDisabled: false,
  maxWidth: '',
  small: true,
};
