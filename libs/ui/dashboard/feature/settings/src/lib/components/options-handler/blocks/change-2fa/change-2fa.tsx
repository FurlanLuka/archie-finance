import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionsItem } from '../../../options-item/options-item';

export const Change2FA: FC = () => {
  const { t } = useTranslation();

  return (
    <OptionsItem
      title={t('dashboard_settings.2fa.title')}
      onClick={() => console.log('clicked')}
    />
  );
};
