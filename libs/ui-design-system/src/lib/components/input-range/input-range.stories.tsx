import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { InputRangeProps, InputRange } from './input-range';

export default {
  title: 'Components/Input Range',
  component: InputRange,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Default: Story<InputRangeProps> = (args) => (
  <StoriesContainer>
    <StoriesTitle title="Input range" subtitle="primary" />
    <div style={{ maxWidth: '30%' }}>
      <InputRange {...args} />
    </div>
  </StoriesContainer>
);

Default.args = {
  label: 'Estimated monthly spending',
  min: 200,
  max: 10000,
  value: 2000,
  onChange: () => console.log('change'),
};
