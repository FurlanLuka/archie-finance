import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonLight, ParagraphS, ParagraphXS } from '@archie-webapps/ui-design-system';
import { theme } from '@archie-webapps/ui-theme';

import { MarginCallAlertStyled } from './margin-call.styled';

export const MarginCallAlert: FC = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <MarginCallAlertStyled>
      <ParagraphS weight={800} color={theme.textLight}>
        {t('margin_call_alert.title')}
      </ParagraphS>
      <ParagraphXS color={theme.textLight}>{t('margin_call_alert.text')}</ParagraphXS>
      <ButtonLight maxWidth="fit-content" color={theme.textDanger} onClick={handleClick}>
        {t('margin_call_alert.btn')}
      </ButtonLight>
    </MarginCallAlertStyled>
  );
};
