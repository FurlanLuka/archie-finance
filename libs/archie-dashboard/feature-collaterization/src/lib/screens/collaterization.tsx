import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonOutline, ButtonPrimary, Card, SubtitleM, ParagraphXS } from '@archie-webapps/ui-design-system';
import { theme } from '@archie-webapps/ui-theme';

import { CollaterizationStyled } from './collaterization.styled';

export const CollaterizationScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <CollaterizationStyled>
      <Card column alignItems="center" padding="2.5rem 1.5rem 3.5rem">
        <SubtitleM className="title">{t('collateralization_step.title')}</SubtitleM>
        <ParagraphXS className="subtitle">{t('collateralization_step.subtitle')}</ParagraphXS>
      </Card>
    </CollaterizationStyled>
  );
};
