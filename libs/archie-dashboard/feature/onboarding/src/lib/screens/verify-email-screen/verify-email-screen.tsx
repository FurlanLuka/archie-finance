import { FC, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { EmailVerificationResponse } from '@archie-webapps/shared/data-access/archie-api/user/api/get-email-verification';
import { useGetEmailVerification } from '@archie-webapps/shared/data-access/archie-api/user/hooks/use-get-email-verification';
import { usePollEmailVerification } from '@archie-webapps/shared/data-access/archie-api/user/hooks/use-poll-email-verification';
import { useResendEmailVerification } from '@archie-webapps/shared/data-access/archie-api/user/hooks/use-resend-email-verification';
import { useAuthenticatedSession } from '@archie-webapps/shared/data-access/session';
import { ButtonPrimary, Card, SubtitleM, ParagraphXS, Loader } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { VerifyEmailScreenStyled } from './verify-email-screen.styled';

export const VerifyEmailScreen: FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuthenticatedSession();

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const [btnDisabled, setBtnDisabled] = useState(false);
  const [counter, setCounter] = useState(30);

  const getEmailVerificationResponse: QueryResponse<EmailVerificationResponse> = useGetEmailVerification();
  const mutationResponse = useResendEmailVerification();
  usePollEmailVerification();

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  const handleResend = () => {
    if (mutationResponse.state === RequestState.IDLE) {
      mutationResponse.mutate({});
    }

    setBtnDisabled(true);

    interval.current = setInterval(() => {
      if (counter > 0) {
        setCounter((counter) => counter - 1);
      }
    }, 1000);

    timer.current = setTimeout(() => {
      setBtnDisabled(false);

      if (interval.current) {
        clearInterval(interval.current);
      }

      setCounter(30);
    }, 30000);
  };

  function getContent() {
    if (getEmailVerificationResponse.state === RequestState.LOADING) {
      return <Loader className="loader" />;
    }

    if (getEmailVerificationResponse.state === RequestState.ERROR) {
      return <Navigate to="/onboarding/error" state={{ prevPath: '/onboarding' }} />;
    }

    if (getEmailVerificationResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <SubtitleM className="title">{t('verify_email_step.title')}</SubtitleM>
          <ParagraphXS className="subtitle">
            {t('verify_email_step.subtitle', { email: getEmailVerificationResponse.data.email })}
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
          <ButtonPrimary className="resend-btn" type="submit" isDisabled={btnDisabled} onClick={handleResend}>
            {btnDisabled
              ? t('verify_email_step.resend_btn_disabled', { counter: `00:${counter}` })
              : t('verify_email_step.resend_btn')}
          </ButtonPrimary>
        </>
      );
    }

    return <></>;
  }

  return (
    <VerifyEmailScreenStyled>
      <Card column alignItems="center" padding="1.5rem" minHeight="400px">
        {getContent()}
      </Card>
    </VerifyEmailScreenStyled>
  );
};
