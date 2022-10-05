import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetAutopay } from '@archie-webapps/shared/data-access/archie-api/autopay/hooks/use-get-autopay';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';

import { ManageAutopayModal } from '../../../modals/manage-autopay/manage-autopay';
import { OptionsItem } from '../options-item/options-item';

export const AutopayItem: FC = () => {
  const { t } = useTranslation();
  const [manageAutopayModalOpen, setManageAutopayModalOpen] = useState(false);
  const getAutopayResponse = useGetAutopay();

  function getAutopayText() {
    if (getAutopayResponse.state === RequestState.SUCCESS) {
      if (getAutopayResponse.data === null) {
        return 'off';
      }
      return 'on';
    }

    return '...';
  }

  return (
    <>
      <OptionsItem
        title={t('dashboard_settings.autopay.title')}
        subtitle={t('dashboard_settings.autopay.subtitle', { autopay: getAutopayText() })}
        onClick={() => {
          setManageAutopayModalOpen(true);
        }}
      />
      {manageAutopayModalOpen && <ManageAutopayModal close={() => setManageAutopayModalOpen(false)} />}
    </>
  );
};
