import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, TitleM, BodyM } from '@archie-webapps/shared/ui/design-system';

export const InterestRate: FC = () => {
  const { t } = useTranslation();

  // Temp data
  const interestRate = 13;

  return (
    <Card column alignItems="flex-start" padding="1.5rem">
      <BodyM weight={700} className="card-title">
        {t('interest_rate_card.title')}
      </BodyM>
      <TitleM weight={400} className="card-info">
        {interestRate}%
      </TitleM>
    </Card>
  );
};
