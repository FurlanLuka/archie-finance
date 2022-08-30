import { differenceInDays } from 'date-fns';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ParagraphXXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { NextPaymentChartStyled } from './next-payment.styled';

const min = 0;
const max = 30;

interface NextPaymentChartProps {
  dueDate: Date;
}

export const NextPaymentChart: FC<NextPaymentChartProps> = ({ dueDate }) => {
  const { t } = useTranslation();

  const days = differenceInDays(dueDate, new Date());
  const value = max - days;
  const backgroundSize = ((value - min) * 100) / (max - min) + '% 100%';

  return (
    <NextPaymentChartStyled backgroundSize={backgroundSize}>
      <ParagraphXXS color={theme.textSecondary} weight={500}>
        {t('next_payment_card.chart', { days })}
      </ParagraphXXS>
      <input type="range" min={min} max={max} value={value} readOnly />
    </NextPaymentChartStyled>
  );
};
