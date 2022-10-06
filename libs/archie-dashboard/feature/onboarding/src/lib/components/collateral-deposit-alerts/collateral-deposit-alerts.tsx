import { FC, useMemo, useState } from 'react';

import { usePollLedgerChanges } from '@archie-webapps/archie-dashboard/hooks';
import { calculateLedgerCreditValue, formatLedgerAccountsToString } from '@archie-webapps/archie-dashboard/utils';

import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';
import { NotEnoughCollateralModal } from '../modals/not-enough-collateral/not-enough-collateral';
import { CreateCreditLine } from '../toasts/create-credit-line/create-credit-line';
import { NotEnoughCollateral } from '../toasts/not-enough-collateral/not-enough-collateral';

import { getCollateralDepositState, CollateralDepositState } from './collateral-deposit-alerts.helpers';

export const CollateralDepositAlerts: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onLedgerChange = () => {
    setIsModalOpen(true);
  };

  const { currentLedger, startPolling } = usePollLedgerChanges({
    onLedgerChange,
    initialLedger: {
      value: '0',
      accounts: [],
    }, // we don't have any yet
  });

  const collateralText = useMemo(() => formatLedgerAccountsToString(currentLedger.accounts), [currentLedger]);
  const collateralCreditValue = useMemo(() => calculateLedgerCreditValue(currentLedger), [currentLedger]);

  const currentCollateralDepositState = getCollateralDepositState(
    isModalOpen,
    collateralCreditValue,
    currentLedger.accounts,
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
        ledgerValue={currentLedger.value}
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
