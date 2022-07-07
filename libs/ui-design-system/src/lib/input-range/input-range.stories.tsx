import { Story, Meta } from '@storybook/react';

import { InputRangeProps, InputRange } from './input-range';

export default {
  title: 'Components/Input Range',
  component: InputRange,
} as Meta;

export const Template: Story<InputRangeProps> = (args) => <InputRange {...args} />;
Template.args = {
  label: 'Estimated monthly spending',
  min: 200,
  max: 10000,
  value: 2000,
  onChange: () => console.log('change'),
};
