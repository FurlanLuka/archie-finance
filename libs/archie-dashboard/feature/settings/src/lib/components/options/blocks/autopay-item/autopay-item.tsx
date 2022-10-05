import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AutopayModal } from '../../../modals/autopay/autopay';
import { OptionsItem } from '../options-item/options-item';

export const AutopayItem: FC = () => {
  const { t } = useTranslation();
  const [autopayModalOpen, setAutopayModalOpen] = useState(false);

  //temp data
  const autopay = 'on';

  return (
    <>
      <OptionsItem
        title={t('dashboard_settings.autopay.title')}
        subtitle={t('dashboard_settings.autopay.subtitle', { autopay })}
        onClick={() => setAutopayModalOpen(true)}
      />
      {autopayModalOpen && <AutopayModal close={() => setAutopayModalOpen(false)} />}
    </>
  );
};
