import { FC, useCallback, useMemo, useState } from 'react';

import { MIN_LINE_OF_CREDIT } from '@archie-webapps/archie-dashboard/constants';
import { calculateCollateralCreditValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';

import { CreateCreditLine } from '../alerts/create-credit-line/create-credit-line';
import { NotEnoughCollateral } from '../alerts/not-enough-collateral/not-enough-collateral';
import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';
import { NotEnoughCollateralModal } from '../modals/not-enough-collateral/not-enough-collateral';

import { formatEntireCollateral } from './collateral-deposit.helpers';
import { usePollCollateralDeposit } from './use-poll-collateral-deposit';

export const CollateralDeposit: FC = () => {
  const [shouldPoll, setShouldPoll] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCollateral, setCurrentCollateral] = useState<CollateralValue[]>([]);

  const onCollateralChange = useCallback(
    (newCollateral: CollateralValue[]) => {
      if (JSON.stringify(newCollateral) !== JSON.stringify(currentCollateral)) {
        setShouldPoll(false);
        setCurrentCollateral(newCollateral);
        setIsModalOpen(true);
      }
    },
    [currentCollateral],
  );
  const collateralText = useMemo(() => formatEntireCollateral(currentCollateral), [currentCollateral]);
  const collateralTotalValue = useMemo(() => calculateCollateralCreditValue(currentCollateral), [currentCollateral]);

  // is this hook going to be used somewhere else? if not let's have it here, as we do in collateralization-screen
  usePollCollateralDeposit({
    onCollateralChange,
    shouldPoll,
  });

  if (isModalOpen) {
    if (collateralTotalValue > MIN_LINE_OF_CREDIT) {
      return (
        <CollateralReceivedModal
          onClose={() => {
            setIsModalOpen(false);
            setShouldPoll(true);
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
          setShouldPoll(true);
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
