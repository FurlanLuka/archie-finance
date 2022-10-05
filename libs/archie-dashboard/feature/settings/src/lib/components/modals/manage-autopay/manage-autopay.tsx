import { FC } from 'react';

import { useGetAutopay } from '@archie-webapps/shared/data-access/archie-api/autopay/hooks/use-get-autopay';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { Autopay } from '../../autopay/autopay';

interface ManageAutopayModalProps {
  close: VoidFunction;
}

export const ManageAutopayModal: FC<ManageAutopayModalProps> = ({ close }) => {
  const getAutopayResponse = useGetAutopay();

  function getContent() {
    if (getAutopayResponse.state === RequestState.LOADING) {
      return (
        <Modal maxWidth="780px" isOpen close={close}>
          <Loader marginAuto />
        </Modal>
      );
    }

    if (getAutopayResponse.state === RequestState.ERROR) {
      return (
        <Modal maxWidth="780px" isOpen close={close}>
          Something went wrong, try refreshing the page
        </Modal>
      );
    }

    if (getAutopayResponse.state === RequestState.SUCCESS) {
      if (getAutopayResponse.data !== null) {
        return <span>ajej nesi zrihtou</span>;
      }

      return <Autopay close={close} />;
    }

    return <></>;
  }

  return (
    <Modal maxWidth="780px" isOpen close={close}>
      {getContent()}
    </Modal>
  );
};
