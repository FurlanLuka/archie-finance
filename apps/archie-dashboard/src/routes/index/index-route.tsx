import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Header, Loading, Page, Container } from '@archie-webapps/ui-design-system';

import { Navigation } from './components/navigation/navigation';
import { History } from './components/screens/history/history';
import { Rewards } from './components/screens/rewards/rewards';
import { Settings } from './components/screens/settings/settings';
import { WalletAndCollateral } from './components/screens/wallet-and-collateral/wallet-and-collateral';

export const DashboardRoute: FC = () => {
  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  if (queryResponse.state === RequestState.LOADING) {
    return <Loading />;
  }

  // if (queryResponse.state === RequestState.SUCCESS) {
  //   if (!queryResponse.data.completed) {
  //     return <Navigate to="/onboarding" />;
  //   }
  // }

  return (
    <>
      <Header maxWidth="100%" />
      <Page>
        <Container justifyContent="center" maxWidth="100%">
          <Navigation />
          <Routes>
            <Route path="/" element={<WalletAndCollateral />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Container>
      </Page>
    </>
  );
};
