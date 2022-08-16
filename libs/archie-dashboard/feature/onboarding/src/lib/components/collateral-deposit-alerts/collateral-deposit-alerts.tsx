import { FC, useMemo, useState } from 'react';

import { usePollCollateralDeposit } from '@archie-webapps/archie-dashboard/hooks';
import {
  calculateCollateralCreditValue,
  calculateCollateralTotalValue,
  formatEntireCollateral,
} from '@archie-webapps/archie-dashboard/utils';

import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';
import { NotEnoughCollateralModal } from '../modals/not-enough-collateral/not-enough-collateral';
import { CreateCreditLine } from '../toasts/create-credit-line/create-credit-line';
import { NotEnoughCollateral } from '../toasts/not-enough-collateral/not-enough-collateral';

import { getCollateralDepositState, CollateralDepositState } from './collateral-deposit-alerts.helpers';

export const CollateralDepositAlerts: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCollateralAmountChange = () => {
    setIsModalOpen(true);
  };

  const { currentCollateral, startPolling } = usePollCollateralDeposit({
    onCollateralAmountChange,
    initialCollateral: [], // we don't have any yet
  });

  const collateralText = useMemo(() => formatEntireCollateral(currentCollateral), [currentCollateral]);
  const collateralCreditValue = useMemo(() => calculateCollateralCreditValue(currentCollateral), [currentCollateral]);
  const collateralTotalValue = useMemo(() => calculateCollateralTotalValue(currentCollateral), [currentCollateral]);

  const currentCollateralDepositState = getCollateralDepositState(
    isModalOpen,
    collateralCreditValue,
    currentCollateral,
  );

  if (currentCollateralDepositState === CollateralDepositState.COLLATERAL_RECEIVED_MODAL) {
    return (
      <CollateralReceivedModal
        onClose={() => {
          setIsModalOpen(false);
          startPolling();
        }}
        onConfirm={() => {
          setIsModalOpen(false);
        }}
        collateralValue={collateralTotalValue}
        creditValue={collateralCreditValue}
      />
    );
  }

  if (currentCollateralDepositState === CollateralDepositState.NOT_ENOUGH_COLLATERAL_MODAL) {
    return (
      <NotEnoughCollateralModal
        creditValue={collateralCreditValue}
        onClose={() => {
          setIsModalOpen(false);
          startPolling();
        }}
      />
    );
  }

  if (currentCollateralDepositState === CollateralDepositState.CREATE_CREDIT_LINE_TOAST) {
    return <CreateCreditLine collateralText={collateralText} creditValue={collateralCreditValue} />;
  }

  if (currentCollateralDepositState === CollateralDepositState.NOT_ENOUGH_COLLATERAL_TOAST) {
    return <NotEnoughCollateral creditValue={collateralCreditValue} />;
  }

  return <></>;
};
