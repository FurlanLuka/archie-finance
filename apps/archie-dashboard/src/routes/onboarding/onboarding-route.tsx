import { useState } from 'react';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import Loading from '../../components/_generic/loading/loading';
import { KycStep } from './components/onboarding-steps/kyc-step/kyc-step';
import { CollateralizationStep } from './components/onboarding-steps/collateralization-step/collateralization-step';
import { CardStep } from './components/onboarding-steps/card-step/card-step';
import { OnboardingStyled } from './onboarding-route.styled';
import { Page } from '../../components/_generic/layout/layout.styled';
import Header from '../../components/_generic/header/header';

export enum step {
  KYC = 'kyc',
  COLLATERALIZE = 'collateralize',
  CARD = 'getcard',
}

export const OnboardingRoute: React.FC = () => {
  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  const [currentStep, setCurrentStep] = useState(step.COLLATERALIZE);

  const getCurrentStep = (state: step) => {
    switch (state) {
      case step.KYC:
        return <KycStep setCurrentStep={setCurrentStep} />;
      case step.COLLATERALIZE:
        return <CollateralizationStep setCurrentStep={setCurrentStep} />;
      case step.CARD:
        return <CardStep />;
      default:
        return <KycStep setCurrentStep={setCurrentStep} />;
    }
  };

  return (
    <>
      <Header />
      <Page>
        <OnboardingStyled>
          {queryResponse.state === RequestState.LOADING && <Loading />}
          {queryResponse.state === RequestState.SUCCESS && getCurrentStep(currentStep)}
        </OnboardingStyled>
      </Page>
    </>
  );
};
