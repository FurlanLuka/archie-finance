import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { queryClient } from '@archie/ui/shared/data-access/query-client';
import { SessionProvider } from '@archie/ui/shared/data-access/session';
import { GlobalStyles, theme } from '@archie/ui/shared/theme';

import { App } from './app/app';
import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
} from './constants/auth';

ReactDOM.render(
  <>
    <GlobalStyles />
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionProvider
          domain={AUTH0_DOMAIN}
          clientId={AUTH0_CLIENT_ID}
          audience={AUTH0_AUDIENCE}
          redirectUri={window.location.origin}
          onLogout={() => console.log('hello!')}
        >
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </SessionProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  </>,
  document.getElementById('root'),
);