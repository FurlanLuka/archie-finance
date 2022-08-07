import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-webapps/shared/ui/theme';

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
    <Skeleton />
  </StoriesContainer>
);

export const WithBackgroundColor: Story<SkeletonProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Loader" subtitle="with background color" />
    <Skeleton {...props} />
  </StoriesContainer>
);

WithBackgroundColor.args = {
  bgColor: theme.backgroundSecondary,
};
