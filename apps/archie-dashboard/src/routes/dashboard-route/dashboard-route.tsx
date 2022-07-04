import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { WalletAndCollateralScreen } from '@archie-webapps/archie-dashboard/feature-wallet-and-collateral';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { GetOnboardingResponse } from '@archie-webapps/shared/data-access-archie-api/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie-webapps/shared/data-access-archie-api/onboarding/hooks/use-get-onboarding';
import { Header, Loading, Page, Container } from '@archie-webapps/ui-design-system';
import { HistoryScreen } from '@archie-webapps/archie-dashboard/feature-history';
import { RewardsScreen } from '@archie-webapps/archie-dashboard/feature-rewards';
import { SettingsScreen } from '@archie-webapps/archie-dashboard/feature-settings';

import { Navigation } from '../../components/navigation/navigation';

export const DashboardRoute: FC = () => {
  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  if (queryResponse.state === RequestState.LOADING) {
    return <Loading />;
  }

  if (queryResponse.state === RequestState.SUCCESS) {
    if (!queryResponse.data.completed) {
      return <Navigate to="/onboarding" />;
    }
  }

  return (
    <>
      <Header maxWidth="100%" />
      <Page>
        <Container justifyContent="center" maxWidth="100%">
          <Navigation />
          <Routes>
            <Route path="/" element={<WalletAndCollateralScreen />} />
            <Route path="/rewards" element={<RewardsScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </Container>
      </Page>
    </>
  );
};
