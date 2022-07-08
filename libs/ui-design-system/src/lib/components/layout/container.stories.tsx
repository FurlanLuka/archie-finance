import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { ContainerProps, Container } from './layout.styled';

export default {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Default: Story<ContainerProps> = (args) => (
  <StoriesContainer>
    <StoriesTitle title="Container" />
    <Container {...args}>Container Layout</Container>
  </StoriesContainer>
);
