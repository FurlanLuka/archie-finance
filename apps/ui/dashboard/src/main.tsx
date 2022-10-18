import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'styled-components';

import { queryClient } from '@archie-webapps/shared/data-access/query-client';
import { SessionProvider } from '@archie-webapps/shared/data-access/session';
import { GlobalStyles, theme } from '@archie-webapps/shared/ui/theme';

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
