import { FC, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import {
  MutationState,
  RequestState,
} from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetEmailVerification } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-get-email-verification';
import { usePollEmailVerification } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-poll-email-verification';
import { useResendEmailVerification } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-resend-email-verification';
import { useAuthenticatedSession } from '@archie/ui/shared/data-access/session';
import {
  ButtonPrimary,
  Card,
  Skeleton,
  TitleL,
  BodyM,
} from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { VerifyEmailScreenStyled } from './verify-email-screen.styled';

export const VerifyEmailScreen: FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuthenticatedSession();

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const [btnDisabled, setBtnDisabled] = useState(false);
  const [counter, setCounter] = useState(30);

  const getEmailVerificationResponse = useGetEmailVerification();
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
    if (mutationResponse.state === MutationState.IDLE) {
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
      return (
        <Card height="400px">
          <Skeleton />
        </Card>
      );
    }

    if (getEmailVerificationResponse.state === RequestState.ERROR) {
      return (
        <Navigate to="/onboarding/error" state={{ prevPath: '/onboarding' }} />
      );
    }

    if (getEmailVerificationResponse.state === RequestState.SUCCESS) {
      return (
        <Card column alignItems="center" padding="1.5rem">
          <TitleL className="title">{t('verify_email_step.title')}</TitleL>
          <BodyM className="text">
            {t('verify_email_step.subtitle', {
              email: getEmailVerificationResponse.data.email,
            })}
          </BodyM>
          <BodyM className="text">{t('verify_email_step.text_1')}</BodyM>
          <div className="link">
            <BodyM>{t('verify_email_step.text_2')}</BodyM>
            <button className="logout-btn" onClick={logout}>
              <BodyM weight={700} color={theme.textPositive}>
                {t('verify_email_step.logout_btn')}
              </BodyM>
            </button>
          </div>
          <hr className="divider" />
          <ButtonPrimary
            type="submit"
            width="100%"
            className="resend-btn"
            isDisabled={btnDisabled}
            onClick={handleResend}
          >
            {btnDisabled
              ? t('verify_email_step.resend_btn_disabled', {
                  counter: `00:${counter}`,
                })
              : t('verify_email_step.resend_btn')}
          </ButtonPrimary>
        </Card>
      );
    }

    return <></>;
  }

  return <VerifyEmailScreenStyled>{getContent()}</VerifyEmailScreenStyled>;
};
