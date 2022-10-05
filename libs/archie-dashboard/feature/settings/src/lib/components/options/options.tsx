import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { AutopayItem } from './blocks/autopay-item/autopay-item';
import { OptionsItem } from './blocks/options-item/options-item';
import { OptionsStyled } from './options.styled';

export const Options: FC = () => {
  const { t } = useTranslation();

  return (
    <OptionsStyled>
      <OptionsItem title={t('dashboard_settings.password.title')} onClick={() => console.log('clicked')} />
      <OptionsItem title={t('dashboard_settings.2fa.title')} onClick={() => console.log('clicked')} />
      <AutopayItem />
      <OptionsItem
        title={t('dashboard_settings.support.title')}
        subtitle={t('dashboard_settings.support.subtitle')}
        onClick={() => console.log('clicked')}
      />
      <OptionsItem
        title={t('dashboard_settings.whitelisted_addresses.title')}
        subtitle={t('dashboard_settings.whitelisted_addresses.subtitle')}
        onClick={() => console.log('clicked')}
      />
    </OptionsStyled>
  );
};
