import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCodeInput from 'react-verification-code-input';

import { useCompleteAptoVerification } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-complete-apto-verification';
import { useStartAptoVerification } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-start-apto-verification';
import { MutationQueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { ButtonPrimary, ParagraphXS, SubtitleM } from '@archie-webapps/shared/ui-design-system';
import { Icon } from '@archie-webapps/shared/ui-icons';
import { theme } from '@archie-webapps/shared/ui-theme';

import { VerifyScreenStyled } from './verify-screen.styled';

export const VerifyScreen: FC = () => {
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
    <VerifyScreenStyled>
      <SubtitleM className="title">{t('verify_step.title')}</SubtitleM>
      <ParagraphXS className="subtitle">{t('verify_step.subtitle')}</ParagraphXS>
      <ReactCodeInput onComplete={(values) => setCode(values)} className="code-input" />
      <ParagraphXS className="resend-text">{t('verify_step.resend_text')}</ParagraphXS>
      <button className="resend-btn" onClick={handleResend}>
        <ParagraphXS weight={700} color={theme.textHighlight}>
          {t('verify_step.resend_btn')}
        </ParagraphXS>
      </button>
      <hr className="divider" />
      <ButtonPrimary
        type="submit"
        onClick={handleSubmit}
        isDisabled={!isValid}
        isLoading={useCompleteAptoVerificationQuery.state === RequestState.LOADING}
      >
        {t('btn_next')}
        <Icon name="arrow-right" fill={theme.textLight} />
      </ButtonPrimary>
    </VerifyScreenStyled>
  );
};
