import { FC, useEffect, useState } from 'react';

import { OnboardingStep } from '@archie-microservices/ui/dashboard/constants';
import {
  QueryResponse,
  RequestState,
} from '@archie-microservices/ui/shared/data-access/archie-api/interface';
import { GetOnboardingResponse } from '@archie-microservices/ui/shared/data-access/archie-api/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie-microservices/ui/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';
import { LoaderFullScreen } from '@archie-microservices/ui/shared/ui/design-system';

import { CardScreen } from '../card-screen/card-screen';
import { CollateralizationScreen } from '../collateralization-screen/collateralization-screen';
import { KycScreen } from '../kyc-screen/kyc-screen';
import { VerifyEmailScreen } from '../verify-email-screen/verify-email-screen';

import { OnboardingStyled } from './onboarding-handler.styled';

function getCurrentStep(step: OnboardingStep) {
  switch (step) {
    case OnboardingStep.KYC:
      return <KycScreen />;
    case OnboardingStep.VERIFY_EMAIL:
      return <VerifyEmailScreen />;
    case OnboardingStep.COLLATERALIZE:
      return <CollateralizationScreen />;
    case OnboardingStep.CARD:
      return <CardScreen />;
    default:
      return <KycScreen />;
  }
}

export const OnboardingHandler: FC = () => {
  const queryResponse: QueryResponse<GetOnboardingResponse> =
    useGetOnboarding();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>();

  useEffect(() => {
    if (queryResponse.state === RequestState.SUCCESS) {
      if (queryResponse.data.kycStage === false) {
        setCurrentStep(OnboardingStep.KYC);
      } else if (queryResponse.data.emailVerificationStage === false) {
        setCurrentStep(OnboardingStep.VERIFY_EMAIL);
      } else if (queryResponse.data.collateralizationStage === false) {
        setCurrentStep(OnboardingStep.COLLATERALIZE);
      } else if (queryResponse.data.cardActivationStage === false) {
        setCurrentStep(OnboardingStep.CARD);
      }
    }
  }, [queryResponse]);

  return (
    <OnboardingStyled>
      {currentStep === undefined && <LoaderFullScreen />}
      {currentStep !== undefined && getCurrentStep(currentStep)}
    </OnboardingStyled>
  );
};
