import { Story, Meta } from '@storybook/react';

import { Page } from './layout.styled';

export default {
  title: 'Layout/Page',
  component: Page,
} as Meta;

export const Template: Story = (args) => <Page {...args}>Page Layout</Page>;
