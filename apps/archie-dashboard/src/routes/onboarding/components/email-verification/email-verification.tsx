import { FC } from 'react';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { usePollEmailVerification } from '@archie/api-consumer/user/hooks/use-poll-email-verification';
import { useResendEmailVerification } from '@archie/api-consumer/user/hooks/use-resend-email-verification';
import { ParagraphS, ParagraphXS } from '../../../../components/_generic/typography/typography.styled';
import imgResend from '../../../../assets/images/img-resend.png';
import { EmailVerificationStyled } from './email-verification.styled';

export const EmailVerification: FC = () => {
  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();
  usePollEmailVerification();

  const mutationResponse = useResendEmailVerification();

  const handleClick = () => {
    if (mutationResponse.state === RequestState.IDLE) {
      mutationResponse.mutate({});
    }
  };

  if (queryResponse.state === RequestState.SUCCESS) {
    if (queryResponse.data.emailVerificationStage) {
      return <></>;
    }
  }

  return (
    <EmailVerificationStyled>
      <div className="image">
        <img src={imgResend} alt="Resend verification email" />
      </div>
      <div className="text">
        <ParagraphS weight={700}>Please verify your email</ParagraphS>
        <ParagraphXS>
          Check your email for a verification link from Archie. Click
          <button onClick={handleClick}>here</button>
          to resend it.
        </ParagraphXS>
      </div>
    </EmailVerificationStyled>
  );
};
