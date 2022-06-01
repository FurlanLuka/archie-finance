import { FC, useState } from 'react';
import ReactCodeInput from 'react-verification-code-input';
import { Step } from '../../../../../constants/onboarding-steps';
import { SubtitleS, ParagraphXS } from '../../../../../components/_generic/typography/typography.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';
import { ArrowRight } from '../../../../../components/_generic/icons/arrow-right';
import { colors, theme } from '../../../../../constants/theme';
import { VerifyStepStyled } from './verify-step.styled';

interface VerifyStepProps {
  setCurrentStep: (step: Step) => void;
}

export const VerifyStep: FC<VerifyStepProps> = ({ setCurrentStep }) => {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    console.log(code);
    // setCurrentStep(Step.COLLATERALIZE);
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
