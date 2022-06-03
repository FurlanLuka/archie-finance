import { FC, useEffect, useState } from 'react';
import ReactCodeInput from 'react-verification-code-input';
import { useCompleteAptoVerification } from '@archie/api-consumer/credit/hooks/use-complete-apto-verification';
import { useStartAptoVerification } from '@archie/api-consumer/credit/hooks/use-start-apto-verification';
import { MutationQueryResponse, RequestState } from '@archie/api-consumer/interface';
import { SubtitleS, ParagraphXS } from '../../../../../components/_generic/typography/typography.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';
import { ArrowRight } from '../../../../../components/_generic/icons/arrow-right';
import { colors, theme } from '../../../../../constants/theme';
import { VerifyStepStyled } from './verify-step.styled';

export const VerifyStep: FC = () => {
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

  const handleSubmit = () => {
    if (isInitialLoading || code.length !== 6) {
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
    <VerifyStepStyled>
      <SubtitleS className="title">Verify phone number</SubtitleS>
      <ParagraphXS className="subtitle">Enter the 6-digit code you received via text message.</ParagraphXS>
      <ReactCodeInput onComplete={(values) => setCode(values)} className="code-input" />
      <ParagraphXS className="resend-text">Didn’t get it?</ParagraphXS>
      <button className="resend-btn" onClick={handleResend}>
        <ParagraphXS weight={700} color={theme.textHighlight}>
          Resend
        </ParagraphXS>
      </button>
      <hr className="divider" />
      <ButtonPrimary type="submit" onClick={handleSubmit}>
        Next
        <ArrowRight fill={colors.white} />
      </ButtonPrimary>
    </VerifyStepStyled>
  );
};
