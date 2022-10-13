import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionsItem } from '../../../options-item/options-item';

export const ContactSupport: FC = () => {
  const { t } = useTranslation();

  return (
    <OptionsItem
      title={t('dashboard_settings.support.title')}
      subtitle={t('dashboard_settings.support.subtitle')}
      onClick={() => console.log('clicked')}
    />
  );
};
