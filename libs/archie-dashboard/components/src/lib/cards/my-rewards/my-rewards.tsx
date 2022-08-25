import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonOutline, Card, ParagraphXS, ParagraphXXS, SubtitleS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

export const MyRewards: FC = () => {
  const { t } = useTranslation();

  return (
    <Card column alignItems="flex-start" padding="1.5rem">
      <ParagraphXS weight={700} className="card-title">
        {t('my_rewards_card.title')}
      </ParagraphXS>
      <div className="text-group card-info">
        <SubtitleS weight={400}>1,801</SubtitleS>
        <ParagraphXS weight={500}>{t('my_rewards_card.note_1')}</ParagraphXS>
      </div>
      <div className="text-group card-info">
        <ParagraphXS color={theme.textSuccess} weight={500} className="card-text">
          +$1,400
        </ParagraphXS>
        <ParagraphXXS color={theme.textSecondary} weight={500} className="card-text">
          {t('my_rewards_card.note_2')}
        </ParagraphXXS>
      </div>
      <div className="btn-group">
        <ButtonOutline maxWidth="auto" small>
          {t('btn_claim')}
        </ButtonOutline>
      </div>
    </Card>
  );
};
