import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { usePollEmailVerification } from '@archie/api-consumer/user/hooks/use-poll-email-verification';
import { useResendEmailVerification } from '@archie/api-consumer/user/hooks/use-resend-email-verification';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ParagraphS, ParagraphXS } from '@archie-webapps/ui-design-system';

import imgResend from '../../../assets/img-resend.png';

import { EmailVerificationStyled } from './email-verification.styled';

export const EmailVerification: FC = () => {
  const { t } = useTranslation();

  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();
  usePollEmailVerification();

  const mutationResponse = useResendEmailVerification();

  const handleClick = () => {
    if (mutationResponse.state === RequestState.IDLE) {
      mutationResponse.mutate({});
    }
  };

  if (queryResponse.state === RequestState.LOADING) {
    return <></>;
  }

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
        <ParagraphS weight={700}>{t('email_verification.title')}</ParagraphS>
        <ParagraphXS>
          {t('email_verification.text_1')}
          <button onClick={handleClick}>{t('email_verification.btn')}</button>
          {t('email_verification.text_2')}
        </ParagraphXS>
      </div>
    </EmailVerificationStyled>
  );
};
