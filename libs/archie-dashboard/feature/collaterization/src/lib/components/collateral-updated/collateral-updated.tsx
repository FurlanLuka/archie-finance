import { FC, useMemo, useState } from 'react';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';

import { usePollCollateralDeposit } from '@archie-webapps/archie-dashboard/hooks';
import { calculateCollateralCreditValue, formatEntireCollateral } from '@archie-webapps/archie-dashboard/utils';

import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';

interface CollateralDepositProps {
  initialCollateral: CollateralValue[];
}
export const CollateralDeposit: FC<CollateralDepositProps> = ({ initialCollateral }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCollateralAmountChange = () => {
    setIsModalOpen(true);
  };

  const { currentCollateral } = usePollCollateralDeposit({
    onCollateralAmountChange,
    initialCollateral,
  });

  const collateralText = useMemo(() => formatEntireCollateral(currentCollateral), [currentCollateral]);
  const collateralTotalValue = useMemo(() => calculateCollateralCreditValue(currentCollateral), [currentCollateral]);

  if (isModalOpen) {
    return (
      <CollateralReceivedModal
        onConfirm={() => {
          setIsModalOpen(false);
        }}
        collateralText={collateralText}
        creditValue={collateralTotalValue}
      />
    );
  }

  return null;
};
