import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonLight, ParagraphS, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

export const Warning: FC = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <>
      <ParagraphS weight={800} color={theme.textLight}>
        {t('close_to_margin_call_alert.title')}
      </ParagraphS>
      <ParagraphXS color={theme.textLight}>{t('close_to_margin_call_alert.text')}</ParagraphXS>
      <ButtonLight color={theme.textWarning} onClick={handleClick}>
        {t('close_to_margin_call_alert.btn')}
      </ButtonLight>
    </>
  );
};
