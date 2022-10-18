import { Route, Routes } from 'react-router-dom';

import {
  ErrorScreen,
  Header,
} from '@archie-microservices/ui/dashboard/components';
import { OnboardingHandler } from '@archie-microservices/ui/dashboard/feature/onboarding';
import { Page } from '@archie-webapps/shared/ui/design-system';

export const OnboardingRoute = () => (
  <>
    <Header />
    <Page hasBgImage>
      <Routes>
        <Route path="/error" element={<ErrorScreen />} />
        <Route path="/" element={<OnboardingHandler />} />
      </Routes>
    </Page>
  </>
);
