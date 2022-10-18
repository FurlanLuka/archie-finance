import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  Header,
  Navigation,
} from '@archie-microservices/ui/dashboard/components';
import { ErrorScreen } from '@archie-microservices/ui/dashboard/components';
import { CollateralScreen } from '@archie-microservices/ui/dashboard/feature/collateral';
import { CollateralizationScreen } from '@archie-microservices/ui/dashboard/feature/collateralization';
import { HistoryScreen } from '@archie-microservices/ui/dashboard/feature/history';
import { HomeScreen } from '@archie-microservices/ui/dashboard/feature/home';
import { PaymentScreen } from '@archie-microservices/ui/dashboard/feature/payments';
import { RewardsScreen } from '@archie-microservices/ui/dashboard/feature/rewards';
import { SettingsScreen } from '@archie-microservices/ui/dashboard/feature/settings';
import { WithdrawScreen } from '@archie-microservices/ui/dashboard/feature/withdraw';
import {
  QueryResponse,
  RequestState,
} from '@archie-microservices/ui/shared/data-access/archie-api/interface';
import { GetOnboardingResponse } from '@archie-microservices/ui/shared/data-access/archie-api/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie-microservices/ui/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';
import {
  LoaderFullScreen,
  Page,
  Container,
} from '@archie-microservices/ui/shared/ui/design-system';

import { Setup2faBanner } from '../../components/banners/setup-2fa/setup-2fa';

export const DashboardRoute: FC = () => {
  const queryResponse: QueryResponse<GetOnboardingResponse> =
    useGetOnboarding();

  const isMfaSetup =
    queryResponse.state === RequestState.SUCCESS &&
    queryResponse.data.mfaEnrollmentStage;

  if (queryResponse.state === RequestState.LOADING) {
    return <LoaderFullScreen />;
  }

  if (queryResponse.state === RequestState.SUCCESS) {
    if (!queryResponse.data.completed) {
      return <Navigate to="/onboarding" />;
    }
  }

  return (
    <>
      <Header maxWidth="100%" showMobileNav />
      <Page>
        <Navigation />
        <Container column mobileColumn maxWidth="100%">
          {!isMfaSetup && <Setup2faBanner />}
          <Container justifyContent="center" maxWidth="100%">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/collateral" element={<CollateralScreen />} />
              <Route
                path="/collateral/withdraw/*"
                element={<WithdrawScreen />}
              />
              <Route
                path="/collateral/add/:asset"
                element={<CollateralizationScreen />}
              />
              {/* <Route path="/rewards" element={<RewardsScreen />} /> */}
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/history" element={<HistoryScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/error" element={<ErrorScreen />} />
            </Routes>
          </Container>
        </Container>
      </Page>
    </>
  );
};
