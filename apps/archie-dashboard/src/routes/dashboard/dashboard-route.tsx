import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { HistoryScreen } from '@archie-webapps/archie-dashboard/feature/history';
import { WalletAndCollateralScreen } from '@archie-webapps/archie-dashboard/feature/home';
import { RewardsScreen } from '@archie-webapps/archie-dashboard/feature/rewards';
import { SettingsScreen } from '@archie-webapps/archie-dashboard/feature/settings';
import { Header } from '@archie-webapps/archie-dashboard/ui/components';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { GetOnboardingResponse } from '@archie-webapps/shared/data-access/archie-api/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie-webapps/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';
import { Loading, Page, Container } from '@archie-webapps/shared/ui/design-system';

import { Setup2faBanner } from '../../components/banners/setup-2fa/setup-2fa';
import { Navigation } from '../../components/navigation/navigation';

export const DashboardRoute: FC = () => {
  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  if (queryResponse.state === RequestState.LOADING) {
    return <Loading />;
  }

  const isMfaSetup = queryResponse.state === RequestState.SUCCESS && queryResponse.data.mfaEnrollmentStage;

  if (queryResponse.state === RequestState.SUCCESS) {
    if (!queryResponse.data.completed) {
      return <Navigate to="/onboarding" />;
    }
  }

  return (
    <>
      <Header maxWidth="100%" />
      <Page>
        <Container column mobileColumn maxWidth="100%">
          {!isMfaSetup && <Setup2faBanner />}
          <Container justifyContent="center" maxWidth="100%">
            <Navigation />
            <Routes>
              <Route path="/" element={<WalletAndCollateralScreen />} />
              <Route path="/rewards" element={<RewardsScreen />} />
              <Route path="/history" element={<HistoryScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </Container>
        </Container>
      </Page>
    </>
  );
};
