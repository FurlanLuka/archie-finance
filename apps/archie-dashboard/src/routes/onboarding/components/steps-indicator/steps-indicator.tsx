import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Step } from '../../../../constants/onboarding-steps';
import { IndicatorDone } from '../../../../components/_generic/icons/indicator-done';
import { IndicatorActive } from '../../../../components/_generic/icons/indicator-active';
import { ArrowIndicatorRight } from '../../../../components/_generic/icons/arrow-indicator-right';
import { ParagraphXXS } from '../../../../components/_generic/typography/typography.styled';
import { StepsIndicatorStyled } from './steps-indicator.styled';
import { theme } from '@archie-webapps/ui-theme';

interface StepsIndicatorProps {
  currentStep: string;
}

export const StepsIndicator: FC<StepsIndicatorProps> = ({ currentStep }) => {
  const { t } = useTranslation();

  return (
    <StepsIndicatorStyled>
      <div className="step">
        <div className="circle">
          <IndicatorDone />
        </div>
        <ParagraphXXS weight={700} color={theme.textPositive}>
          {t('steps_indicator.first')}
        </ParagraphXXS>
        <ArrowIndicatorRight className="arrow" fill={theme.textPositive} />
      </div>
      <div className="step">
        <div className="circle">{currentStep === Step.COLLATERALIZE ? <IndicatorActive /> : <IndicatorDone />}</div>
        <ParagraphXXS
          weight={700}
          color={currentStep === Step.COLLATERALIZE ? theme.textHighlight : theme.textPositive}
        >
          {t('steps_indicator.second')}
        </ParagraphXXS>
        <ArrowIndicatorRight
          className="arrow"
          fill={currentStep === Step.CARD ? theme.textPositive : theme.textDisabled}
        />
      </div>
      <div className="step">
        <div className="circle">{currentStep === Step.CARD && <IndicatorDone />}</div>
        <ParagraphXXS weight={700} color={currentStep === Step.CARD ? theme.textPositive : theme.textDisabled}>
          {t('steps_indicator.third')}
        </ParagraphXXS>
      </div>
    </StepsIndicatorStyled>
  );
};
