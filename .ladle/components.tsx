import type { GlobalProvider } from '@ladle/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyles, theme } from '@archie/ui/shared/theme';

export const Provider: GlobalProvider = ({ children }) => (
  <>
    <GlobalStyles />
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </>
);
