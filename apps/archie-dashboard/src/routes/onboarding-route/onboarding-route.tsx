import { OnboardingHandler } from '@archie-webapps/archie-dashboard/feature-onboarding';
import { ProtectedRoute } from '@archie-webapps/shared/feature-routing';

export const OnboardingRoute = () => (
  <ProtectedRoute>
    <OnboardingHandler />
  </ProtectedRoute>
);
