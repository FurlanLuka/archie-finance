import { differenceInDays } from 'date-fns';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { BodyS } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { NextPaymentChartStyled } from './next-payment.styled';

interface NextPaymentChartProps {
  dueDate: Date;
}

export const NextPaymentChart: FC<NextPaymentChartProps> = ({ dueDate }) => {
  const { t } = useTranslation();

  const min = 0;
  const max = 31;
  const days = differenceInDays(dueDate, new Date());
  const value = max - days;
  const backgroundSize = ((value - min) * 100) / (max - min) + '% 100%';

  console.log(days);

  const getChartLabel = () => {
    if (days < 0) {
      return t('next_payment_card.chart_label.past');
    } else if (days === 0) {
      return t('next_payment_card.chart_label.today');
    } else if (days === 1) {
      return t('next_payment_card.chart_label.tomorrow');
    }

    return t('next_payment_card.chart_label.future', { days });
  };

  const getChartColor = () => {
    if (days < 0) {
      return theme.nextPaymentDanger;
    } else if (days === 0 || days === 1) {
      return theme.nextPaymentWarning;
    }

    return theme.nextPaymentOk;
  };

  return (
    <NextPaymentChartStyled
      backgroundSize={backgroundSize}
      backgroundColor={getChartColor()}
    >
      <BodyS color={theme.textSecondary} weight={500}>
        {getChartLabel()}
      </BodyS>
      <input type="range" min={min} max={max} value={value} readOnly />
    </NextPaymentChartStyled>
  );
};
