import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonLight, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

export const Warning: FC = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <>
      <BodyL weight={800} color={theme.textLight}>
        {t('close_to_margin_call_alert.title')}
      </BodyL>
      <BodyM color={theme.textLight}>{t('close_to_margin_call_alert.text')}</BodyM>
      <ButtonLight color={theme.textWarning} onClick={handleClick}>
        {t('close_to_margin_call_alert.btn')}
      </ButtonLight>
    </>
  );
};
