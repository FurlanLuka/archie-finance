import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ParagraphXXS } from '@archie-webapps/shared/ui-design-system';
import { Icon } from '@archie-webapps/shared/ui-icons';
import { theme } from '@archie-webapps/shared/ui-theme';
import { Step } from '@archie-webapps/archie-dashboard/util-constants';

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
          {currentStep === Step.COLLATERALIZE ? (
            <Icon name="indicator-active" fill={theme.textHighlight} className="icon-active" />
          ) : (
            <Icon name="indicator-done" fill={theme.textPositive} />
          )}
        </div>
        <ParagraphXXS
          weight={700}
          color={currentStep === Step.COLLATERALIZE ? theme.textHighlight : theme.textPositive}
        >
          {t('steps_indicator.second')}
        </ParagraphXXS>
        <Icon
          name="arrow-indicator-right"
          className="arrow"
          fill={currentStep === Step.CARD ? theme.textPositive : theme.textDisabled}
        />
      </div>
      <div className="step">
        <div className="circle">
          {currentStep === Step.CARD ? (
            <Icon name="indicator-done" fill={theme.textPositive} />
          ) : (
            <div className="circle" />
          )}
        </div>
        <ParagraphXXS weight={700} color={currentStep === Step.CARD ? theme.textPositive : theme.textDisabled}>
          {t('steps_indicator.third')}
        </ParagraphXXS>
      </div>
    </StepsIndicatorStyled>
  );
};
