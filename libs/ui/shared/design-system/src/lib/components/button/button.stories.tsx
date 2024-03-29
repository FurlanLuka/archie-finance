import { Story } from '@ladle/react';

import { theme } from '@archie/ui/shared/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import {
  Button,
  ButtonProps,
  ButtonPrimary,
  ButtonOutline,
  ButtonGhost,
  ButtonLight,
} from './button.styled';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
};

export const Primary: Story<ButtonProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Button" subtitle="primary" />
    <ButtonPrimary {...props}>Next</ButtonPrimary>
  </StoriesContainer>
);

Primary.args = {
  isLoading: false,
  isDisabled: false,
  width: '',
  small: false,
  color: '',
};

export const Outline: Story<ButtonProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Button" subtitle="outline" />
    <ButtonOutline {...props}>Next</ButtonOutline>
  </StoriesContainer>
);

Outline.args = {
  isLoading: false,
  isDisabled: false,
  width: '',
  small: false,
  color: '',
};

export const Ghost: Story<ButtonProps> = (props) => (
  <StoriesContainer bgColor="#ececec">
    <StoriesTitle title="Button" subtitle="ghost" />
    <ButtonGhost {...props}>Next</ButtonGhost>
  </StoriesContainer>
);

Ghost.args = {
  isLoading: false,
  isDisabled: false,
  width: '',
  small: false,
  color: '',
};

export const Light: Story<ButtonProps> = (props) => (
  <StoriesContainer bgColor="#ececec">
    <StoriesTitle title="Button" subtitle="light" />
    <ButtonLight {...props}>Next</ButtonLight>
  </StoriesContainer>
);

Light.args = {
  isLoading: false,
  isDisabled: false,
  width: '',
  small: false,
  color: theme.textDanger,
};
