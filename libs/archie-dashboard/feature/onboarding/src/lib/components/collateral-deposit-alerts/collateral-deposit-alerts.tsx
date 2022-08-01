import { FC, useCallback, useMemo, useState } from 'react';

import { calculateCollateralCreditValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';

import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';
import { NotEnoughCollateralModal } from '../modals/not-enough-collateral/not-enough-collateral';
import { CreateCreditLine } from '../toasts/create-credit-line/create-credit-line';
import { NotEnoughCollateral } from '../toasts/not-enough-collateral/not-enough-collateral';

import {
  formatEntireCollateral,
  getCollateralDepositState,
  CollateralDepositState,
} from './collateral-deposit-alerts.helpers';
import { usePollCollateralDeposit } from './use-poll-collateral-deposit';

export const CollateralDepositAlerts: FC = () => {
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

  const currentCollateralDepositState = getCollateralDepositState(isModalOpen, collateralTotalValue, currentCollateral);

  // is this hook going to be used somewhere else? if not let's have it here, as we do in collateralization-screen
  // TODO after merging https://github.com/Archie-Finance/archie-web-apps/pull/41
  usePollCollateralDeposit({
    onCollateralChange,
    shouldPoll,
  });

  if (currentCollateralDepositState === CollateralDepositState.COLLATERAL_RECEIVED_MODAL) {
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

  if (currentCollateralDepositState === CollateralDepositState.NOT_ENOUGH_COLLATERAL_MODAL) {
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

  if (currentCollateralDepositState === CollateralDepositState.CREATE_CREDIT_LINE_TOAST) {
    return <CreateCreditLine collateralText={collateralText} creditValue={collateralTotalValue} />;
  }

  if (currentCollateralDepositState === CollateralDepositState.NOT_ENOUGH_COLLATERAL_TOAST) {
    return <NotEnoughCollateral creditValue={collateralTotalValue} collateralText={collateralText} />;
  }

  return <></>;
};
