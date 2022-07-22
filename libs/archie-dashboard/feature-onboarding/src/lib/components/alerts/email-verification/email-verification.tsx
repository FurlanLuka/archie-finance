import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { GetOnboardingResponse } from '@archie-webapps/shared/data-access-archie-api/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie-webapps/shared/data-access-archie-api/onboarding/hooks/use-get-onboarding';
import { usePollEmailVerification } from '@archie-webapps/shared/data-access-archie-api/user/hooks/use-poll-email-verification';
import { useResendEmailVerification } from '@archie-webapps/shared/data-access-archie-api/user/hooks/use-resend-email-verification';
import { ParagraphS, ParagraphXS } from '@archie-webapps/shared/ui-design-system';

import imgResend from '../../../../assets/img-resend.png';

import { EmailVerificationAlertStyled } from './email-verification.styled';

export const EmailVerificationAlert: FC = () => {
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
    <EmailVerificationAlertStyled>
      <div className="image">
        <img src={imgResend} alt={t('email_verification_alert.img_alt')} />
      </div>
      <div className="text">
        <ParagraphS weight={700}>{t('email_verification_alert.title')}</ParagraphS>
        <ParagraphXS>
          {t('email_verification_alert.text_1')}
          <button onClick={handleClick}>{t('email_verification_alert.btn')}</button>
          {t('email_verification_alert.text_2')}
        </ParagraphXS>
      </div>
    </EmailVerificationAlertStyled>
  );
};
