import { Story, Meta } from '@storybook/react';

import { CardProps, Card } from './card.styled';

export default {
  title: 'Components/Card',
  component: Card,
} as Meta;

export const Template: Story<CardProps> = (args) => <Card {...args}>Card Title</Card>;
Template.args = {
  maxWidth: '400px',
};
