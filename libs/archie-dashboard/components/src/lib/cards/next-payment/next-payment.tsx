import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { NextPaymentChart } from '@archie-webapps/archie-dashboard/components';
import { ButtonOutline, Card, ParagraphXS, SubtitleS } from '@archie-webapps/shared/ui/design-system';

interface NextPaymentProps {
  withBtn?: boolean;
}

export const NextPayment: FC<NextPaymentProps> = ({ withBtn }) => {
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
      {withBtn && (
        <div className="btn-group">
          <ButtonOutline maxWidth="auto" small>
            Pay now
          </ButtonOutline>
        </div>
      )}
    </Card>
  );
};
