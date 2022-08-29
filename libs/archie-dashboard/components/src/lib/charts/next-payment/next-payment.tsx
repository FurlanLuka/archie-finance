import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ParagraphXXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { NextPaymentChartStyled } from './next-payment.styled';

const days = 13;
const min = 0;
const max = 20;
const value = 7;

export const NextPaymentChart: FC = () => {
  const { t } = useTranslation();

  const getBackgroundSize = () => ((value - min) * 100) / (max - min) + '% 100%';

  // Temp data
  const days = 7;

  return (
    <NextPaymentChartStyled backgroundSize={getBackgroundSize()}>
      <ParagraphXXS color={theme.textSecondary} weight={500}>
        {t('next_payment_card.chart', { days })}
      </ParagraphXXS>
      <input type="range" min={min} max={max} value={value} readOnly />
    </NextPaymentChartStyled>
  );
};
