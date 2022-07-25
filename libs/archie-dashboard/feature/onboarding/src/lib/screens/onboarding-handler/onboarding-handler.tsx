import { FC, useEffect, useState } from 'react';

import { Step } from '@archie-webapps/archie-dashboard/constants';
import { Header } from '@archie-webapps/archie-dashboard/ui/components';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { GetOnboardingResponse } from '@archie-webapps/shared/data-access/archie-api/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie-webapps/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';
import { Loading, Page } from '@archie-webapps/shared/ui/design-system';

import { CardScreen } from '../card-screen/card-screen';
import { CollateralizationScreen } from '../collateralization-screen/collateralization-screen';
import { KycScreen } from '../kyc-screen/kyc-screen';
import { VerifyScreen } from '../verify-screen/verify-screen';

import { OnboardingStyled } from './onboarding-handler.styled';

function getCurrentStep(step: Step) {
  switch (step) {
    case Step.KYC:
      return <KycScreen />;
    case Step.COLLATERALIZE:
      return <CollateralizationScreen />;
    case Step.CARD:
      return <CardScreen />;
    default:
      return <KycScreen />;
  }
}

export const OnboardingHandler: FC = () => {
  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  const [currentStep, setCurrentStep] = useState<Step>();

  useEffect(() => {
    if (queryResponse.state === RequestState.SUCCESS) {
      if (queryResponse.data.kycStage === false) {
        setCurrentStep(Step.KYC);
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
