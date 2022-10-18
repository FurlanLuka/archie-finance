import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonOutline,
  Card,
  TitleM,
  BodyM,
  BodyS,
} from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

export const Rewards: FC = () => {
  const { t } = useTranslation();

  return (
    <Card
      column
      alignItems="flex-start"
      justifyContent="space-between"
      padding="1.5rem"
    >
      <BodyM weight={700} className="card-title">
        {t('rewards_card.title')}
      </BodyM>
      <div className="text-group card-info">
        <TitleM weight={400}>1,801</TitleM>
        <BodyM weight={500}>{t('rewards_card.note_1')}</BodyM>
      </div>
      <div className="text-group card-info">
        <BodyM color={theme.textSuccess} weight={500} className="card-text">
          +$1,400
        </BodyM>
        <BodyS color={theme.textSecondary} weight={500} className="card-text">
          {t('rewards_card.note_2')}
        </BodyS>
      </div>
      <div className="btn-group">
        <ButtonOutline small>{t('btn_claim')}</ButtonOutline>
      </div>
    </Card>
  );
};
