import { Story, Meta } from '@storybook/react';

import { ButtonProps, ButtonPrimary, ButtonOutline, ButtonGhost, ButtonLight } from './button.styled';

export default {
  title: 'Components/Button',
  component: ButtonPrimary,
} as Meta;

export const Primary: Story<ButtonProps> = (args) => <ButtonPrimary {...args}>Next</ButtonPrimary>;
Primary.args = {
  maxWidth: 'fit-content',
};

export const Outline: Story<ButtonProps> = (props) => <ButtonOutline {...props}>Next</ButtonOutline>;
Outline.args = {
  maxWidth: 'fit-content',
};

export const Ghost: Story<ButtonProps> = (props) => <ButtonGhost {...props}>Next</ButtonGhost>;
Ghost.args = {
  maxWidth: 'fit-content',
};

export const Light: Story<ButtonProps> = (props) => <ButtonLight {...props}>Next</ButtonLight>;
Light.args = {
  maxWidth: 'fit-content',
};
