import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePollCollateralDeposit } from '@archie-webapps/archie-dashboard/hooks';
import { calculateCollateralCreditValue, calculateCollateralTotalValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { Modal } from '@archie-webapps/shared/ui/design-system';

import { CollateralReceived } from './blocks/collateral-received/collateral-received';

interface CollateralUpdatedModalProps {
  initialCollateral: CollateralValue[];
}

export const CollateralUpdatedModal: FC<CollateralUpdatedModalProps> = ({ initialCollateral }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCollateralAmountChange = () => {
    setIsModalOpen(true);
  };

  const { currentCollateral } = usePollCollateralDeposit({
    onCollateralAmountChange,
    initialCollateral,
  });

  const collateralCreditValue = useMemo(() => calculateCollateralCreditValue(currentCollateral), [currentCollateral]);
  const collateralTotalValue = useMemo(() => calculateCollateralTotalValue(currentCollateral), [currentCollateral]);

  if (isModalOpen) {
    return (
      <Modal isOpen={true} maxWidth="800px">
        <CollateralReceived
          onConfirm={() => {
            setIsModalOpen(false);
            navigate('/collateral');
          }}
          collateralValue={collateralTotalValue}
          creditValue={collateralCreditValue}
        />
      </Modal>
    );
  }

  return <></>;
};
