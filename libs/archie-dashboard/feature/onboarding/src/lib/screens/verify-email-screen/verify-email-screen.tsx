import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCodeInput from 'react-verification-code-input';

import { useCompleteAptoVerification } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-complete-apto-verification';
import { useStartAptoVerification } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-start-apto-verification';
import { MutationQueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonPrimary, Card, ParagraphXS, ParagraphXXS, SubtitleM } from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';
import { theme } from '@archie-webapps/shared/ui/theme';

import { VerifyEmailScreenStyled } from './verify-email-screen.styled';

export const VerifyEmailScreen: FC = () => {
  const { t } = useTranslation();

  const [code, setCode] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const useCompleteAptoVerificationQuery: MutationQueryResponse<unknown> = useCompleteAptoVerification();
  const useStartAptoVerificationQuery: MutationQueryResponse<unknown> = useStartAptoVerification();

  useEffect(() => {
    if (useStartAptoVerificationQuery.state === RequestState.IDLE) {
      useStartAptoVerificationQuery.mutate({});

      return;
    }

    if (useStartAptoVerificationQuery.state === RequestState.SUCCESS) {
      setIsInitialLoading(false);
    }
  }, [useStartAptoVerificationQuery]);

  const isValid = code.length === 6;

  const handleSubmit = () => {
    if (isInitialLoading || !isValid) {
      return;
    }

    if (useCompleteAptoVerificationQuery.state === RequestState.IDLE) {
      useCompleteAptoVerificationQuery.mutate({
        secret: new String(code),
      });
    }
  };

  const handleResend = () => {
    console.log('resend');
  };

  return (
    <VerifyEmailScreenStyled>
      <Card column alignItems="center" padding="1.5rem">
        <SubtitleM className="title">{t('verify_email_step.title')}</SubtitleM>
        <ParagraphXS className="subtitle">{t('verify_email_step.subtitle')}</ParagraphXS>
        <ParagraphXS className="text">{t('verify_email_step.text_1')}</ParagraphXS>
        <div className="">
          <ParagraphXS className="text">{t('verify_email_step.text_2')}</ParagraphXS>
          <button className="resend-btn" onClick={handleResend}>
            <ParagraphXS weight={700} color={theme.textHighlight}>
              {t('verify_email_step.link')}
            </ParagraphXS>
          </button>
        </div>
        <hr className="divider" />
        <ButtonPrimary
          type="submit"
          onClick={handleSubmit}
          isLoading={useCompleteAptoVerificationQuery.state === RequestState.LOADING}
        >
          {t('verify_email_step.btn')}
        </ButtonPrimary>
      </Card>
    </VerifyEmailScreenStyled>
  );
};
