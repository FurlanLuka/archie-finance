import { Auth0Provider } from '@auth0/auth0-react';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/router/protected-route';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './constants';
import { DashboardRoute } from './routes/dashboard/dashboard-route';
import { LoginRoute } from './routes/login/login-route';

ReactDOM.render(
  <StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
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
          <Route path="/login" element={<LoginRoute />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>,
  document.getElementById('root'),
);
