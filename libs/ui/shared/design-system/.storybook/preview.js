import { withThemes } from '@react-theming/storybook-addon';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { addDecorator, addParameters } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyles, theme } from '@archie/ui/shared/theme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

const themes = [
  {
    name: 'Theme',
    backgroundColor: theme.backgroundPrimary,
    ...theme,
  },
];
const themingDecorator = withThemes(ThemeProvider, themes);

export const decorators = [themingDecorator];

addDecorator((Story) => (
  <>
    <GlobalStyles />
    <Story />
  </>
));

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});
