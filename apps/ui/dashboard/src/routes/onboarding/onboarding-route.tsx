import { Route, Routes } from 'react-router-dom';

import {
  ErrorScreen,
  Header,
} from '@archie-webapps/archie-dashboard/components';
import { OnboardingHandler } from '@archie-webapps/archie-dashboard/feature/onboarding';
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
