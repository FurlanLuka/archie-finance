import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { EmailVerificationResponse } from '@archie-webapps/shared/data-access/archie-api/user/api/get-email-verification';
import { useGetEmailVerification } from '@archie-webapps/shared/data-access/archie-api/user/hooks/use-get-email-verification';
import { useResendEmailVerification } from '@archie-webapps/shared/data-access/archie-api/user/hooks/use-resend-email-verification';
import { useAuthenticatedSession } from '@archie-webapps/shared/data-access/session';
import { ButtonPrimary, Card, Loading, SubtitleM, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { VerifyEmailScreenStyled } from './verify-email-screen.styled';

export const VerifyEmailScreen: FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuthenticatedSession();

  const getEmailVerificationResponse: QueryResponse<EmailVerificationResponse> = useGetEmailVerification();
  const mutationResponse = useResendEmailVerification();

  const getEmailVerification = () => {
    if (getEmailVerificationResponse.state === RequestState.SUCCESS) {
      return getEmailVerificationResponse.data.email;
    }

    return '';
  };

  const handleResend = () => {
    if (mutationResponse.state === RequestState.IDLE) {
      mutationResponse.mutate({});
    }
  };

  if (getEmailVerificationResponse.state === RequestState.LOADING) {
    return <Loading />;
  }

  return (
    <VerifyEmailScreenStyled>
      <Card column alignItems="center" padding="1.5rem">
        <SubtitleM className="title">{t('verify_email_step.title')}</SubtitleM>
        <ParagraphXS className="subtitle">
          {t('verify_email_step.subtitle', { email: getEmailVerification() })}
        </ParagraphXS>
        <ParagraphXS className="text">{t('verify_email_step.text_1')}</ParagraphXS>
        <div className="link">
          <ParagraphXS>{t('verify_email_step.text_2')}</ParagraphXS>
          <button className="logout-btn" onClick={logout}>
            <ParagraphXS weight={700} color={theme.textPositive}>
              {t('verify_email_step.logout_btn')}
            </ParagraphXS>
          </button>
        </div>
        <hr className="divider" />
        <ButtonPrimary className="resend-btn" type="submit" onClick={handleResend}>
          {t('verify_email_step.resend_btn')}
        </ButtonPrimary>
      </Card>
    </VerifyEmailScreenStyled>
  );
};
