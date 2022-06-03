import { useEffect, useState } from 'react';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { Step } from '../../constants/onboarding-steps';
import Loading from '../../components/_generic/loading/loading';
import { KycStep } from './components/onboarding-steps/kyc-step/kyc-step';
import { VerifyStep } from './components/onboarding-steps/verify-step/verify-step';
import { CollateralizationStep } from './components/onboarding-steps/collateralization-step/collateralization-step';
import { CardStep } from './components/onboarding-steps/card-step/card-step';
import { OnboardingStyled } from './onboarding-route.styled';
import { Page } from '../../components/_generic/layout/layout.styled';
import Header from '../../components/_generic/header/header';

export const OnboardingRoute: React.FC = () => {
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

  const getCurrentStep = (state: Step) => {
    switch (state) {
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
  };

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
