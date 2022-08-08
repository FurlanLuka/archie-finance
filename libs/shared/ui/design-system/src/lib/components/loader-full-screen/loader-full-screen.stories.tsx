import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { LoaderFullScreen } from './loader-full-screen';

export default {
  title: 'Layout/Loader Full Screen',
  component: LoaderFullScreen,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
} as Meta;

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Loader Full Screen" />
    <LoaderFullScreen />
  </StoriesContainer>
);
