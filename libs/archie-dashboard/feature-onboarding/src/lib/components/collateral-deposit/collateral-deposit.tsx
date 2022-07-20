import { FC, useCallback, useMemo, useState } from 'react';

import { CollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral-value';

import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';

import { CreateCreditLine } from './blocks/create_credit_line/create_credit_line';
import { calculateCollateralValue, formatEntireCollateral } from './helpers';
import { usePollCollateralDeposit } from './use-poll-collateral-deposit';

export const CollateralDeposit: FC = () => {
  const [shouldPoll, setShouldPoll] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCollateral, setCurrentCollateral] = useState<CollateralValue[]>([]);

  const onCollateralChange = useCallback(
    (newCollateral: CollateralValue[]) => {
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
  const collateralText = useMemo(() => formatEntireCollateral(currentCollateral), [currentCollateral]);
  const collateralTotalValue = useMemo(() => calculateCollateralValue(currentCollateral), [currentCollateral]);

  usePollCollateralDeposit({
    onCollateralChange,
    shouldPoll,
  });

  if (isModalOpen) {
    return (
      <CollateralReceivedModal
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={() => {
          setIsModalOpen(false);
          setShouldPoll(true);
        }}
        collateralText={collateralText}
        creditValue={collateralTotalValue}
      />
    );
  }

  if (!isModalOpen && currentCollateral.length > 0) {
    return <CreateCreditLine collateralText={collateralText} creditValue={collateralTotalValue} />;
  }

  return null;
};
