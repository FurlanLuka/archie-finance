import { FC, useMemo, useState } from 'react';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';

import { usePollCollateralDeposit } from '@archie-webapps/archie-dashboard/hooks';
import { calculateCollateralCreditValue, calculateCollateralTotalValue } from '@archie-webapps/archie-dashboard/utils';

import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';
import { useNavigate } from 'react-router-dom';

interface CollateralDepositProps {
  initialCollateral: CollateralValue[];
}

export const CollateralDeposit: FC<CollateralDepositProps> = ({ initialCollateral }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(true);

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
      <CollateralReceivedModal
        onConfirm={() => {
          setIsModalOpen(false);
          navigate('/collateral');
        }}
        collateralValue={collateralTotalValue}
        creditValue={collateralCreditValue}
      />
    );
  }

  return null;
};
