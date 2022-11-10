import type { StoryDecorator } from '@ladle/react';
import { Story } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyles, theme } from '@archie/ui/shared/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import {
  ButtonProps,
  ButtonPrimary,
  ButtonOutline,
  ButtonGhost,
  ButtonLight,
} from './button.styled';

export default {
  title: 'Components/Button',
  decorators: [
    (Component) => (
      <>
        <GlobalStyles />
        <ThemeProvider theme={theme}>
          <Component />
        </ThemeProvider>
      </>
    ),
  ] as StoryDecorator[],
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
