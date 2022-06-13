import { FC } from 'react';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import imgCard from '../../assets/images/placeholder-card.png';
import imgBalance from '../../assets/images/placeholder-balance.png';
import { theme } from '../../constants/theme';
import { ParagraphM, ParagraphXXS } from '../../components/_generic/typography/typography.styled';
import Loading from '../../components/_generic/loading/loading';
import { Page } from '../../components/_generic/layout/layout.styled';
import Header from '../../components/_generic/header/header';
import { Navigation } from './components/navigation/navigation';
import { IndexStyled } from './index-route.styled';

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
        <IndexStyled>
          <Navigation />
          <div className="content">
            <ParagraphM weight={800} className="title">
              Hi, xxx
            </ParagraphM>
            <ParagraphXXS color={theme.textSecondary} className="subtitle">
              Member since June, 2022
            </ParagraphXXS>
            <div className="cards">
              <div className="card">
                <img src={imgCard} />
              </div>
              <div className="card">
                <img src={imgBalance} />
              </div>
            </div>
          </div>
        </IndexStyled>
      </Page>
    </>
  );
};
