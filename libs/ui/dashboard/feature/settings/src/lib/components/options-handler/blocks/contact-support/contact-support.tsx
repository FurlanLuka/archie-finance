import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionsItem } from '../../../options-item/options-item';

export const ContactSupport: FC = () => {
  const { t } = useTranslation();

  return (
    <a href="mailto:support@archie.finance?subject=I need help with my Archie account">
      <OptionsItem
        title={t('dashboard_settings.support.title')}
        subtitle={t('dashboard_settings.support.subtitle')}
      />
    </a>
  );
};
