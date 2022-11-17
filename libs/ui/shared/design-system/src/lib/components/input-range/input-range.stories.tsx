import { Story } from '@ladle/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { InputRangeProps, InputRange } from './input-range';

export default {
  title: 'Components/Input Range',
  component: InputRange,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
};

export const Default: Story<InputRangeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Input range" />
    <div style={{ maxWidth: '30%' }}>
      <InputRange {...props} />
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
