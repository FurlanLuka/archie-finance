import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { ContainerProps, Container } from './layout.styled';

export default {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Default: Story<ContainerProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Container" />
    <Container {...props}>Container Layout</Container>
  </StoriesContainer>
);

Default.args = {
  column: false,
  alignItems: '',
  justifyContent: '',
  maxWidth: '',
  mobileColumn: false,
  mobileJustifyContent: '',
  mobileAlignItems: '',
};
