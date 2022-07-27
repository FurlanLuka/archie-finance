import { FC, useMemo, useState } from 'react';

import { MIN_LINE_OF_CREDIT } from '@archie-webapps/archie-dashboard/constants';
import { usePollCollateralDeposit } from '@archie-webapps/archie-dashboard/hooks';
import { calculateCollateralCreditValue } from '@archie-webapps/archie-dashboard/utils';

import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';
import { NotEnoughCollateralModal } from '../modals/not-enough-collateral/not-enough-collateral';

import { CreateCreditLine } from './blocks/create_credit_line/create_credit_line';
import { NotEnoughCollateral } from './blocks/not-enough-collateral/not-enough-collateral';
import { formatEntireCollateral } from './collateral-deposit.helpers';

export const CollateralDeposit: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCollateralAmountChange = () => {
    setIsModalOpen(true);
  };

  const { currentCollateral, startPolling } = usePollCollateralDeposit({
    onCollateralAmountChange,
  });

  const collateralText = useMemo(() => formatEntireCollateral(currentCollateral), [currentCollateral]);
  const collateralTotalValue = useMemo(() => calculateCollateralCreditValue(currentCollateral), [currentCollateral]);

  if (isModalOpen) {
    if (collateralTotalValue > MIN_LINE_OF_CREDIT) {
      return (
        <CollateralReceivedModal
          onClose={() => {
            setIsModalOpen(false);
            startPolling();
          }}
          onConfirm={() => {
            setIsModalOpen(false);
          }}
          collateralText={collateralText}
          creditValue={collateralTotalValue}
        />
      );
    }
    return (
      <NotEnoughCollateralModal
        collateralText={collateralText}
        creditValue={collateralTotalValue}
        onClose={() => {
          setIsModalOpen(false);
          startPolling();
        }}
      />
    );
  }

  if (!isModalOpen && currentCollateral.length > 0) {
    if (collateralTotalValue > MIN_LINE_OF_CREDIT) {
      return <CreateCreditLine collateralText={collateralText} creditValue={collateralTotalValue} />;
    }
    return <NotEnoughCollateral creditValue={collateralTotalValue} collateralText={collateralText} />;
  }

  return null;
};
