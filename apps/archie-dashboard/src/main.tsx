import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { SessionProvider } from '@archie-webapps/shared/data-access-session';
import { ProtectedRoute } from '@archie-webapps/shared/feature-routing';
import { GlobalStyles, theme } from '@archie-webapps/ui-theme';

import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './constants/auth';
import { DashboardRoute } from './routes/dashboard-route/dashboard-route';
import { LoginRoute } from './routes/login/login-route';
import { LogoutRoute } from './routes/logout/logout-route';
import './utils/i18next';
import { OnboardingRoute } from './routes/onboarding-route/onboarding-route';

const queryClient: QueryClient = new QueryClient();

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
            <BrowserRouter>
              <Routes>
                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <DashboardRoute />
                    </ProtectedRoute>
                  }
                />
                <Route path="/onboarding" element={<OnboardingRoute />} />
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/logout" element={<LogoutRoute />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </SessionProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  </>,
  document.getElementById('root'),
);
