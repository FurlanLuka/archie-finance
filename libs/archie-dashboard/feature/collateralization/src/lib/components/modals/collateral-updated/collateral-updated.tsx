import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePollLedgerChanges } from '@archie-webapps/archie-dashboard/hooks';
import { calculateLedgerCreditValue } from '@archie-webapps/archie-dashboard/utils';
import { Modal } from '@archie-webapps/shared/ui/design-system';

import { CollateralReceived } from './blocks/collateral-received/collateral-received';
import { Ledger } from '@archie-webapps/shared/data-access/archie-api/ledger/api/get-ledger';

interface CollateralUpdatedModalProps {
  initialLedger: Ledger;
}

export const CollateralUpdatedModal: FC<CollateralUpdatedModalProps> = ({ initialLedger }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onLedgerChange = () => {
    setIsModalOpen(true);
  };

  const { currentLedger } = usePollLedgerChanges({
    onLedgerChange,
    initialLedger,
  });

  const collateralCreditValue = useMemo(() => calculateLedgerCreditValue(currentLedger), [currentLedger]);

  if (isModalOpen) {
    return (
      <Modal isOpen={true} maxWidth="800px">
        <CollateralReceived
          onConfirm={() => {
            setIsModalOpen(false);
            navigate('/collateral');
          }}
          collateralValue={currentLedger.value}
          creditValue={collateralCreditValue}
        />
      </Modal>
    );
  }

  return <></>;
};
