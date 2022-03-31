import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { useAuthenticatedSession } from '@archie/session/hooks/use-session';
import { OnboardingStep } from './components/onboarding-step';
import { EmailVerificationStep } from './components/onboarding-steps/email-verification-step';
import { KycStep } from './components/onboarding-steps/kyc-step';

export const OnboardingRoute: React.FC = () => {
  const { logout } = useAuthenticatedSession();

  const queryResponse: QueryResponse<GetOnboardingResponse> =
    useGetOnboarding();

  return (
    <div className="center-box">
      <h2>Onboarding</h2>
      {queryResponse.state === RequestState.LOADING && <>Loading....</>}
      {queryResponse.state === RequestState.SUCCESS && (
        <>
          <OnboardingStep
            stepTitle="Email verification"
            isCompleted={queryResponse.data.emailVerificationStage}
            stepContent={<EmailVerificationStep />}
            isExpanded={true}
          />
          <br />
          <OnboardingStep
            stepTitle="Kyc verification"
            isCompleted={queryResponse.data.kycStage}
            stepContent={<KycStep />}
            isExpanded={false}
          />
          <br />
          <OnboardingStep
            stepTitle="Collateralization"
            isCompleted={queryResponse.data.collateralizationStage}
            stepContent={<></>}
            isExpanded={false}
            isLocked={true}
          />
          <br />
          <OnboardingStep
            stepTitle="Card activation"
            isCompleted={queryResponse.data.cardActivationStage}
            stepContent={<></>}
            isExpanded={false}
            isLocked={true}
          />
        </>
      )}
      <button className={'button'} onClick={logout}>
        Logout
      </button>
    </div>
  );
};
