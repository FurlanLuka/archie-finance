import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetAutopay } from '@archie-webapps/shared/data-access/archie-api/autopay/hooks/use-get-autopay';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { AutopayAdd } from './blocks/autopay-add/autopay-add';
import { AutopayRemove } from './blocks/autopay-remove/autopay-remove';

interface ManageAutopayModalProps {
  close: VoidFunction;
}

export const ManageAutopayModal: FC<ManageAutopayModalProps> = ({ close }) => {
  const { t } = useTranslation();

  const getAutopayResponse = useGetAutopay();

  const getContent = () => {
    if (getAutopayResponse.state === RequestState.LOADING) {
      return <Loader marginAuto />;
    }

    if (getAutopayResponse.state === RequestState.ERROR) {
      return t('error.refresh_page');
    }

    if (getAutopayResponse.state === RequestState.SUCCESS) {
      if (getAutopayResponse.data !== null) {
        return <AutopayRemove close={close} />;
      }

      return <AutopayAdd close={close} />;
    }

    return <></>;
  };

  return (
    <Modal maxWidth="780px" isOpen close={close}>
      {getContent()}
    </Modal>
  );
};
