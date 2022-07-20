import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { CollateralScreen } from '@archie-webapps/archie-dashboard/feature-collateral';
import { HistoryScreen } from '@archie-webapps/archie-dashboard/feature-history';
import { RewardsScreen } from '@archie-webapps/archie-dashboard/feature-rewards';
import { SettingsScreen } from '@archie-webapps/archie-dashboard/feature-settings';
import { WalletAndCollateralScreen } from '@archie-webapps/archie-dashboard/feature-wallet-and-collateral';
import { WithdrawScreen } from '@archie-webapps/archie-dashboard/feature-withdraw';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { GetOnboardingResponse } from '@archie-webapps/shared/data-access-archie-api/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie-webapps/shared/data-access-archie-api/onboarding/hooks/use-get-onboarding';
import { Header, Loading, Page, Container } from '@archie-webapps/ui-design-system';

import { Setup2faBanner } from '../../components/banners/setup-2fa/setup-2fa';
import { Navigation } from '../../components/navigation/navigation';

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
        <Container column mobileColumn maxWidth="100%">
          {/* <Setup2faBanner /> */}
          <Container justifyContent="center" maxWidth="100%">
            <Navigation />
            <Routes>
              <Route path="/" element={<WalletAndCollateralScreen />} />
              <Route path="/collateral" element={<CollateralScreen />} />
              <Route path="/collateral/withdraw/*" element={<WithdrawScreen />} />
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
