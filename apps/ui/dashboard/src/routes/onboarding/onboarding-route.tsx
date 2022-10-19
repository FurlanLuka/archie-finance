import { Route, Routes } from 'react-router-dom';

import {
  ErrorScreen,
  Header,
} from '@archie/ui/dashboard/components';
import { OnboardingHandler } from '@archie/ui/dashboard/feature/onboarding';
import { Page } from '@archie/ui/shared/ui/design-system';

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
