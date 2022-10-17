import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionsItem } from '../../../options-item/options-item';

export const ResetPassword: FC = () => {
  const { t } = useTranslation();

  return <OptionsItem title={t('dashboard_settings.password.title')} onClick={() => console.log('clicked')} />;
};
