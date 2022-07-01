import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { FC, useEffect, useState } from 'react';

import { Header, Loading, Page } from '@archie-webapps/ui-design-system';
import { Step } from '@archie-webapps/util-constants';

import { CardStep } from '../components/card-step/card-step';
import { CollateralizationStep } from '../components/collateralization-step/collateralization-step';
import { KycStep } from '../components/kyc-step/kyc-step';
import { VerifyStep } from '../components/verify-step/verify-step';

import { OnboardingStyled } from './onboarding-screen.styled';

function getCurrentStep(step: Step) {
  switch (step) {
    case Step.KYC:
      return <KycStep />;
    case Step.VERIFY:
      return <VerifyStep />;
    case Step.COLLATERALIZE:
      return <CollateralizationStep />;
    case Step.CARD:
      return <CardStep />;
    default:
      return <KycStep />;
  }
}

export const OnboardingScreen: FC = () => {
  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  const [currentStep, setCurrentStep] = useState<Step>();

  useEffect(() => {
    if (queryResponse.state === RequestState.SUCCESS) {
      if (queryResponse.data.kycStage === false) {
        setCurrentStep(Step.KYC);
      } else if (queryResponse.data.phoneVerificationStage === false) {
        setCurrentStep(Step.VERIFY);
      } else if (queryResponse.data.collateralizationStage === false) {
        setCurrentStep(Step.COLLATERALIZE);
      } else if (queryResponse.data.cardActivationStage === false) {
        setCurrentStep(Step.CARD);
      }
    }
  }, [queryResponse]);

  return (
    <>
      <Header />
      <Page>
        <OnboardingStyled>
          {currentStep === undefined && <Loading />}
          {currentStep !== undefined && getCurrentStep(currentStep)}
        </OnboardingStyled>
      </Page>
    </>
  );
};
