import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionsItem } from '../../../options-item/options-item';

export const ManageWitelist: FC = () => {
  const { t } = useTranslation();

  return (
    <OptionsItem
      title={t('dashboard_settings.whitelisted_addresses.title')}
      subtitle={t('dashboard_settings.whitelisted_addresses.subtitle')}
      onClick={() => console.log('clicked')}
    />
  );
};
