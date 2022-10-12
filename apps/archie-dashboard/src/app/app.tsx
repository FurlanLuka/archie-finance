import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LoaderFullScreen } from '@archie-webapps/shared/ui/design-system';

import { ProtectedRoute } from '../components/protected-route/protected-route';
import { DashboardRoute } from '../routes/dashboard/dashboard-route';
import { LoginRoute } from '../routes/login/login-route';
import { LogoutRoute } from '../routes/logout/logout-route';
import '../utils/i18next';
import { OnboardingRoute } from '../routes/onboarding/onboarding-route';

import { useStartup } from './use-startup';

// This is separate because we need Auth0 session info here
export const App: FC = () => {
  const { initialized } = useStartup();

  if (!initialized) {
    return <LoaderFullScreen />;
  }

  return (
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
        <Route
          path="/onboarding/*"
          element={
            <ProtectedRoute>
              <OnboardingRoute />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/logout" element={<LogoutRoute />} />
      </Routes>
    </BrowserRouter>
  );
};
