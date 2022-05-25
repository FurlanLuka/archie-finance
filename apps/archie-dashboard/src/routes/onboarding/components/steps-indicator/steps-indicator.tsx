import { FC } from 'react';
import { step } from '../../../../constants/onboarding-steps';
import { theme } from '../../../../constants/theme';
import { IndicatorDone } from '../../../../components/_generic/icons/indicator-done';
import { IndicatorActive } from '../../../../components/_generic/icons/indicator-active';
import { ArrowIndicatorRight } from '../../../../components/_generic/icons/arrow-indicator-right';
import { ParagraphXXS } from '../../../../components/_generic/typography/typography.styled';
import { StepsIndicatorStyled } from './steps-indicator.styled';

interface StepsIndicatorProps {
  currentStep: string;
}

export const StepsIndicator: FC<StepsIndicatorProps> = ({ currentStep }) => (
  <StepsIndicatorStyled>
    <div className="step">
      <div className="circle">
        <IndicatorDone />
      </div>
      <ParagraphXXS weight={700} color={theme.textPositive}>
        Sign-up
      </ParagraphXXS>
      <ArrowIndicatorRight className="arrow" fill={theme.textPositive} />
    </div>
    <div className="step">
      <div className="circle">{currentStep === step.COLLATERALIZE ? <IndicatorActive /> : <IndicatorDone />}</div>
      <ParagraphXXS weight={700} color={currentStep === step.COLLATERALIZE ? theme.textHighlight : theme.textPositive}>
        Collateralize
      </ParagraphXXS>
      <ArrowIndicatorRight
        className="arrow"
        fill={currentStep === step.CARD ? theme.textPositive : theme.textDisabled}
      />
    </div>
    <div className="step">
      <div className="circle">{currentStep === step.CARD && <IndicatorDone />}</div>
      <ParagraphXXS weight={700} color={currentStep === step.CARD ? theme.textPositive : theme.textDisabled}>
        Get Archie Card
      </ParagraphXXS>
    </div>
  </StepsIndicatorStyled>
);
