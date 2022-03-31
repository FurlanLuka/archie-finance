import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/router/protected-route';
import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './constants';
import { DashboardRoute } from './routes/index/index-route';
import { LoginRoute } from './routes/login/login-route';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SessionProvider } from '@archie/session/session-provider';
import { OnboardingRoute } from './routes/onboarding/onboarding-route';

const queryClient: QueryClient = new QueryClient();

ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        audience={AUTH0_AUDIENCE}
        redirectUri={window.location.origin}
        onLogout={() => console.log('hello!')}
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingRoute />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginRoute />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById('root'),
);
