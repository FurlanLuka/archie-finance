import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { CardProps, Card } from './card.styled';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Small: Story<CardProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Card" subtitle="small" />
    <Card {...props}>Card Title</Card>
  </StoriesContainer>
);
Small.args = {
  column: false,
  alignItems: '',
  justifyContent: '',
  maxWidth: '420px',
  padding: '',
  mobileRow: false,
  columnReverse: false,
  mobileJustifyContent: '',
  mobileAlignItems: '',
  backgroundImage: '',
};

export const FullWidth: Story<CardProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Card" subtitle="full width" />
    <Card {...props}>Card Title</Card>
  </StoriesContainer>
);

FullWidth.args = {
  column: false,
  alignItems: '',
  justifyContent: '',
  maxWidth: '100%',
  padding: '',
  mobileRow: false,
  columnReverse: false,
  mobileJustifyContent: '',
  mobileAlignItems: '',
  backgroundImage: '',
};

export const WithBackgroundImage: Story<CardProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Card" subtitle="with background image" />
    <Card {...props}>Card Title</Card>
  </StoriesContainer>
);

WithBackgroundImage.args = {
  column: false,
  alignItems: '',
  justifyContent: '',
  maxWidth: '420px',
  padding: '',
  mobileRow: false,
  columnReverse: false,
  mobileJustifyContent: '',
  mobileAlignItems: '',
  backgroundImage: '',
};
