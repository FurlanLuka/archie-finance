import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { addDecorator, addParameters } from '@storybook/react';
import { withThemesProvider } from 'themeprovider-storybook';

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

export const decorators = [
  withThemesProvider(themes, { disableThemePreview: true }),
];

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
