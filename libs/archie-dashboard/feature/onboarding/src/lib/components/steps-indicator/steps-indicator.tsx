import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { OnboardingStep } from '@archie-webapps/archie-dashboard/constants';
import { ParagraphXXS } from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';
import { theme } from '@archie-webapps/shared/ui/theme';

import { StepsIndicatorStyled } from './steps-indicator.styled';

interface StepsIndicatorProps {
  currentStep: string;
}

export const StepsIndicator: FC<StepsIndicatorProps> = ({ currentStep }) => {
  const { t } = useTranslation();

  return (
    <StepsIndicatorStyled>
      <div className="step">
        <div className="circle">
          <Icon name="indicator-done" fill={theme.textPositive} />
        </div>
        <ParagraphXXS weight={700} color={theme.textPositive}>
          {t('steps_indicator.first')}
        </ParagraphXXS>
        <Icon name="arrow-indicator-right" className="arrow" fill={theme.textPositive} />
      </div>
      <div className="step">
        <div className="circle">
          {currentStep === OnboardingStep.COLLATERALIZE ? (
            <Icon name="indicator-active" fill={theme.textHighlight} className="icon-active" />
          ) : (
            <Icon name="indicator-done" fill={theme.textPositive} />
          )}
        </div>
        <ParagraphXXS
          weight={700}
          color={currentStep === OnboardingStep.COLLATERALIZE ? theme.textHighlight : theme.textPositive}
        >
          {t('steps_indicator.second')}
        </ParagraphXXS>
        <Icon
          name="arrow-indicator-right"
          className="arrow"
          fill={currentStep === OnboardingStep.CARD ? theme.textPositive : theme.textDisabled}
        />
      </div>
      <div className="step">
        <div className="circle">
          {currentStep === OnboardingStep.CARD ? (
            <Icon name="indicator-done" fill={theme.textPositive} />
          ) : (
            <div className="circle" />
          )}
        </div>
        <ParagraphXXS
          weight={700}
          color={currentStep === OnboardingStep.CARD ? theme.textPositive : theme.textDisabled}
        >
          {t('steps_indicator.third')}
        </ParagraphXXS>
      </div>
    </StepsIndicatorStyled>
  );
};
