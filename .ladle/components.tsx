import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import type { GlobalProvider } from '@ladle/react';

import { GlobalStyles, theme } from '../libs/ui/shared/theme/src';

export const Provider: GlobalProvider = ({ children }) => (
  <>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  </>
);
