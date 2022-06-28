import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonLight, ParagraphS, ParagraphXS } from '@archie-webapps/ui-design-system';
import { MarginCallAlertStyled } from './margin-call-alert.styled';
import { theme } from '@archie-webapps/ui-theme';

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
      <ButtonLight onClick={handleClick} maxWidth="fit-content">
        {t('margin_call_alert.btn')}
      </ButtonLight>
    </MarginCallAlertStyled>
  );
};
