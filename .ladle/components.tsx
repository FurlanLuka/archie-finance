import type { GlobalProvider } from '@ladle/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyles, theme } from '@archie/ui/shared/theme';

export const Provider: GlobalProvider = ({ children }) => (
  <>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <GlobalStyles />
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </>
);
