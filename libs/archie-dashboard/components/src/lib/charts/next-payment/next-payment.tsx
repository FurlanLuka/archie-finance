import { FC } from 'react';

import { ParagraphXXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { NextPaymentChartStyled } from './next-payment.styled';

const days = 13;
const min = 0;
const max = 20;
const value = 7;

export const NextPaymentChart: FC = () => {
  const getBackgroundSize = () => ((value - min) * 100) / (max - min) + '% 100%';

  return (
    <NextPaymentChartStyled backgroundSize={getBackgroundSize()}>
      <ParagraphXXS color={theme.textSecondary} weight={500}>
        Due in {days} days
      </ParagraphXXS>
      <input type="range" min={min} max={max} value={value} readOnly />
    </NextPaymentChartStyled>
  );
};
