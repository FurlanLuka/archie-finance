import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonOutline, Card, ParagraphXS, SubtitleS } from '@archie-webapps/shared/ui/design-system';

import { NextPaymentChart } from '../charts/next-payment/next-payment';

export const NextPayment: FC = () => {
  const { t } = useTranslation();

  return (
    <Card column alignItems="flex-start" padding="1.5rem">
      <ParagraphXS weight={700} className="card-title">
        Next Payment
      </ParagraphXS>
      <SubtitleS weight={400} className="card-info">
        June 3
      </SubtitleS>
      <NextPaymentChart />
      <div className="btn-group">
        <ButtonOutline maxWidth="auto" small>
          Pay now
        </ButtonOutline>
      </div>
    </Card>
  );
};
