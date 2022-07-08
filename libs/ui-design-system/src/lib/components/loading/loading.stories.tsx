import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { Loading } from './loading';

export default {
  title: 'Components/Loading Indicator',
  component: Loading,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Default: Story = (args) => (
  <StoriesContainer>
    <StoriesTitle title="Loading indicator" />
    <Loading {...args} />
  </StoriesContainer>
);
