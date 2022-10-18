import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LoaderFullScreen } from '@archie-webapps/shared/ui/design-system';

import '../utils/i18next';
import { ProtectedRoute } from '../components/protected-route/protected-route';
import { DashboardRoute } from '../routes/dashboard/dashboard-route';
import { LoginRoute } from '../routes/login/login-route';
import { LogoutRoute } from '../routes/logout/logout-route';
import { OnboardingRoute } from '../routes/onboarding/onboarding-route';

import { LimitedFunctionalityToast } from './blocks/limited-functionality/limited-functionality';
import { useStartup } from './hooks/use-startup';

export const App: FC = () => {
  const { isInitialized, showLimitedToast } = useStartup();

  if (!isInitialized) {
    return <LoaderFullScreen />;
  }

  return (
    <BrowserRouter>
      {showLimitedToast && <LimitedFunctionalityToast />}
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
