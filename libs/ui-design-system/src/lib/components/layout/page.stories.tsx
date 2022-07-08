import { Story, Meta } from '@storybook/react';

import { Page } from './layout.styled';

export default {
  title: 'Layout/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Default: Story = (args) => <Page {...args} />;
