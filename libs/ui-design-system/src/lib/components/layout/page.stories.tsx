import { Story, Meta } from '@storybook/react';

import { Page } from './layout.styled';

export default {
  title: 'Layout/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
} as Meta;

export const Default: Story = () => <Page />;
