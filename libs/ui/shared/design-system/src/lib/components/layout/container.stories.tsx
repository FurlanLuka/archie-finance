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
    <StoriesTitle title="Container" subtitle="default" />
    <Container {...props}>
      This is a 1400px wide container used across the Marketing site and
      Onboarding flow. It is a flexbox div that receives props to setup the
      layout however needed.
    </Container>
  </StoriesContainer>
);

Default.args = {
  column: false,
  alignItems: '',
  justifyContent: '',
  mobileColumn: false,
  mobileJustifyContent: '',
  mobileAlignItems: '',
};

export const FullWidth: Story<ContainerProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Container" subtitle="Full-width" />
    <Container {...props}>
      This is a full-width container that is basically used in the Dashboard.
      The only difference with the default one is that it has a 100% maxWidth
      prop.
    </Container>
  </StoriesContainer>
);

FullWidth.args = {
  column: false,
  alignItems: '',
  justifyContent: '',
  mobileColumn: false,
  maxWidth: '100%',
  mobileJustifyContent: '',
  mobileAlignItems: '',
};
