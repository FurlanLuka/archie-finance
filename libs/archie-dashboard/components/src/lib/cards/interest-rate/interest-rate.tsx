import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, ParagraphXS, SubtitleS } from '@archie-webapps/shared/ui/design-system';

export const InterestRate: FC = () => {
  const { t } = useTranslation();

  // Temp data
  const interestRate = 13;

  return (
    <Card column alignItems="flex-start" padding="1.5rem">
      <ParagraphXS weight={700} className="card-title">
        {t('interest_rate_card.title')}
      </ParagraphXS>
      <SubtitleS weight={400} className="card-info">
        {interestRate}%
      </SubtitleS>
    </Card>
  );
};
