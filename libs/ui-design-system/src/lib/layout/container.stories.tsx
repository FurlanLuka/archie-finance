import { Story, Meta } from '@storybook/react';

import { ContainerProps, Container } from './layout.styled';

export default {
  title: 'Layout/Container',
  component: Container,
} as Meta;

export const Template: Story<ContainerProps> = (args) => <Container {...args}>Container Layout</Container>;
