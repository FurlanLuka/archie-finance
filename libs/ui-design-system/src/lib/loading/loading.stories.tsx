import { Story, Meta } from '@storybook/react';

import { Loading } from './loading';

export default {
  title: 'Components/Loading Indicator',
  component: Loading,
} as Meta;

export const Template: Story = (args) => <Loading {...args} />;
