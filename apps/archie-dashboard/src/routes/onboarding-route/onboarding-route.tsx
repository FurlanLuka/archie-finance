import { OnboardingScreen } from '@archie-webapps/archie-dashboard/feature-onboarding';
import { ProtectedRoute } from '@archie-webapps/shared/feature-routing';

export const OnboardingRoute = () => (
  <ProtectedRoute>
    <OnboardingScreen />
  </ProtectedRoute>
);
