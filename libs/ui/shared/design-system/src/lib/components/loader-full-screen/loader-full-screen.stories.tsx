import { Story } from '@ladle/react';

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
};

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Loader Full Screen" />
    <div style={{ position: 'relative', height: '85%' }}>
      <LoaderFullScreen />
    </div>
  </StoriesContainer>
);
