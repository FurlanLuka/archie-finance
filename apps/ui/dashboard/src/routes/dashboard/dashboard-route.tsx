import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Header, Navigation } from '@archie/ui/dashboard/components';
import { ErrorScreen } from '@archie/ui/dashboard/components';
import { CollateralScreen } from '@archie/ui/dashboard/feature/collateral';
import { CollateralizationScreen } from '@archie/ui/dashboard/feature/collateralization';
import { HistoryScreen } from '@archie/ui/dashboard/feature/history';
import { HomeScreen } from '@archie/ui/dashboard/feature/home';
import { PaymentScreen } from '@archie/ui/dashboard/feature/payments';
import { RewardsScreen } from '@archie/ui/dashboard/feature/rewards';
import { SettingsScreen } from '@archie/ui/dashboard/feature/settings';
import { WithdrawScreen } from '@archie/ui/dashboard/feature/withdraw';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetOnboarding } from '@archie/ui/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';
import { LoaderFullScreen, Page, Container } from '@archie/ui/shared/design-system';

import { Setup2faBanner } from '../../components/banners/setup-2fa/setup-2fa';

export const DashboardRoute: FC = () => {
  const getOnboardingResponse = useGetOnboarding();

  const isMfaSet =
    getOnboardingResponse.state === RequestState.SUCCESS && getOnboardingResponse.data.mfaEnrollmentStage;

  if (getOnboardingResponse.state === RequestState.LOADING) {
    return <LoaderFullScreen />;
  }

  if (getOnboardingResponse.state === RequestState.SUCCESS) {
    if (!getOnboardingResponse.data.completed) {
      return <Navigate to="/onboarding" />;
    }
  }

  return (
    <>
      <Header maxWidth="100%" showMobileNav />
      <Page>
        <Navigation />
        <Container column mobileColumn maxWidth="100%">
          {!isMfaSet && <Setup2faBanner />}
          <Container justifyContent="center" maxWidth="100%">
            <Routes>
              <Route path="" element={<HomeScreen />} />
              <Route path="home" element={<HomeScreen />} />
              <Route path="collateral" element={<CollateralScreen />} />
              <Route path="collateral/withdraw/:asset" element={<WithdrawScreen />} />
              <Route path="collateral/add/:asset" element={<CollateralizationScreen />} />
              {/* <Route path="/rewards" element={<RewardsScreen />} /> */}
              <Route path="payment" element={<PaymentScreen />} />
              <Route path="history" element={<HistoryScreen />} />
              <Route path="settings" element={<SettingsScreen />} />
              <Route path="error" element={<ErrorScreen />} />
            </Routes>
          </Container>
        </Container>
      </Page>
    </>
  );
};
