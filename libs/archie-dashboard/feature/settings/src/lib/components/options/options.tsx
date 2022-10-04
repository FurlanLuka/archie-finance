import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AutopayModal } from '../../components/modals/autopay/autopay';

import { OptionsItem } from './blocks/options-item/options-item';
import { OptionsStyled } from './options.styled';

export const Options: FC = () => {
  const { t } = useTranslation();

  const [autopayModalOpen, setAutopayModalOpen] = useState(false);

  //temp data
  const autopay = 'on';

  return (
    <>
      <OptionsStyled>
        <OptionsItem title={t('dashboard_settings.password.title')} onClick={() => console.log('clicked')} />
        <OptionsItem title={t('dashboard_settings.2fa.title')} onClick={() => console.log('clicked')} />
        <OptionsItem
          title={t('dashboard_settings.autopay.title')}
          subtitle={t('dashboard_settings.autopay.subtitle', { autopay })}
          onClick={() => setAutopayModalOpen(true)}
        />
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
      {autopayModalOpen && <AutopayModal close={() => setAutopayModalOpen(false)} />}
    </>
  );
};
