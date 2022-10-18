import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-microservices/ui/shared/ui/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { Skeleton, SkeletonProps } from './skeleton.styled';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Skeleton" subtitle="default" />
    <div style={{ position: 'relative', maxWidth: '400px', height: '200px' }}>
      <Skeleton />
    </div>
  </StoriesContainer>
);

export const WithBackgroundColor: Story<SkeletonProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Skeleton" subtitle="with background color" />
    <div style={{ position: 'relative', maxWidth: '400px', height: '200px' }}>
      <Skeleton {...props} />
    </div>
  </StoriesContainer>
);

WithBackgroundColor.args = {
  bgColor: theme.backgroundSecondary,
};
