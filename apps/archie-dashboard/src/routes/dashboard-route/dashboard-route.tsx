import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { WalletAndCollateralScreen } from '@archie-webapps/archie-dashboard/feature-dashboard';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { GetOnboardingResponse } from '@archie-webapps/shared/data-access-archie-api/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie-webapps/shared/data-access-archie-api/onboarding/hooks/use-get-onboarding';
import { Header, Loading, Page, Container } from '@archie-webapps/ui-design-system';

import { Navigation } from '../../components/navigation/navigation';

import { History } from './history/history';
import { Rewards } from './rewards/rewards';
import { Settings } from './settings/settings';

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
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Container>
      </Page>
    </>
  );
};
