import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { CardProps, Card } from './card.styled';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Small: Story<CardProps> = (args) => (
  <StoriesContainer>
    <StoriesTitle title="Card" subtitle="small" />
    <Card {...args}>Card Title</Card>
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

export const FullWidth: Story<CardProps> = (args) => (
  <StoriesContainer>
    <StoriesTitle title="Card" subtitle="full width" />
    <Card {...args}>Card Title</Card>
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

export const WithBackgroundImage: Story<CardProps> = (args) => (
  <StoriesContainer>
    <StoriesTitle title="Card" subtitle="with background image" />
    <Card {...args}>Card Title</Card>
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
