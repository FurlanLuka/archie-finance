import { FC, useCallback, useState } from 'react';

import { Collateral } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral';

import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';

import { CreateCreditLine } from './blocks/create_credit_line/create_credit_line';
import { usePollCollateralDeposit } from './use-poll-collateral-deposit';

export const CollateralDeposit: FC = () => {
  const [shouldPoll, setShouldPoll] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCollateral, setCurrentCollateral] = useState<Collateral[]>([]);

  const onCollateralChange = useCallback(
    (newCollateral: Collateral[]) => {
      // TODO bruh stringify
      // reducer perhaps?
      if (JSON.stringify(newCollateral) !== JSON.stringify(currentCollateral)) {
        setShouldPoll(false);
        setCurrentCollateral(newCollateral);
        setIsModalOpen(true);
      }
    },
    [currentCollateral],
  );

  usePollCollateralDeposit({
    onCollateralChange,
    shouldPoll,
  });

  if (isModalOpen) {
    return (
      <CollateralReceivedModal
        collateral={currentCollateral}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={() => {
          setIsModalOpen(false);
          setShouldPoll(true);
        }}
      />
    );
  }

  if (!isModalOpen && currentCollateral.length > 0) {
    return <CreateCreditLine collateral={currentCollateral} />;
  }

  return null;
};
