import { Story, Meta } from '@storybook/react';

import { theme } from '@archie/ui/shared/ui/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { Loader, LoaderProps } from './loader';

export default {
  title: 'Components/Loader',
  component: Loader,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Loader" subtitle="default" />
    <Loader />
  </StoriesContainer>
);

export const WithCustomColor: Story<LoaderProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Loader" subtitle="with custom color" />
    <Loader {...props} />
  </StoriesContainer>
);

WithCustomColor.args = {
  color: theme.loadingBackground,
};
