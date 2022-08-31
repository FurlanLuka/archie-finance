import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { BodyS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { NextPaymentChartStyled } from './next-payment.styled';

export const NextPaymentChart: FC = () => {
  const { t } = useTranslation();

  // Temp data
  const days = 7;
  const min = 0;
  const max = 20;
  const value = 7;

  const getBackgroundSize = () => ((value - min) * 100) / (max - min) + '% 100%';

  return (
    <NextPaymentChartStyled backgroundSize={getBackgroundSize()}>
      <BodyS color={theme.textSecondary} weight={500}>
        {t('next_payment_card.chart', { days })}
      </BodyS>
      <input type="range" min={min} max={max} value={value} readOnly />
    </NextPaymentChartStyled>
  );
};
