import { Story, Meta } from '@storybook/react';

import { ButtonProps, ButtonPrimary } from './button.styled';

export default {
  component: ButtonPrimary,
  title: 'Button',
} as Meta;

const Template: Story<ButtonProps> = (args) => <ButtonPrimary {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
