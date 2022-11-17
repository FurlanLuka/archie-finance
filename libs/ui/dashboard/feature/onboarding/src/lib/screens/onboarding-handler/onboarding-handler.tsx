import { FC, useEffect, useState } from 'react';

import { OnboardingStep } from '@archie/ui/dashboard/constants';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetOnboarding } from '@archie/ui/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';
import { LoaderFullScreen } from '@archie/ui/shared/design-system';

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
  const getOnboardingResponse = useGetOnboarding();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>();

  useEffect(() => {
    if (getOnboardingResponse.state === RequestState.SUCCESS) {
      if (getOnboardingResponse.data.kycStage === false) {
        setCurrentStep(OnboardingStep.KYC);
      } else if (getOnboardingResponse.data.emailVerificationStage === false) {
        setCurrentStep(OnboardingStep.VERIFY_EMAIL);
      } else if (getOnboardingResponse.data.collateralizationStage === false) {
        setCurrentStep(OnboardingStep.COLLATERALIZE);
      } else if (getOnboardingResponse.data.cardActivationStage === false) {
        setCurrentStep(OnboardingStep.CARD);
      }
    }
  }, [getOnboardingResponse]);

  return (
    <OnboardingStyled>
      {currentStep === undefined && <LoaderFullScreen />}
      {currentStep !== undefined && getCurrentStep(currentStep)}
    </OnboardingStyled>
  );
};
