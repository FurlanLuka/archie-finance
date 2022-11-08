import { FC, useEffect, useMemo, useState } from 'react';

import { LedgerActionType } from '@archie/api/ledger-api/data-transfer-objects/types';
import {
  calculateLedgerCreditValue,
  formatLedgerAccountsToString,
} from '@archie/ui/dashboard/utils';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetLedger } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import {
  LedgerUpdatedWsEvent,
  websocketInstance,
  WsEventTopic,
} from '@archie/ui/shared/data-access/websocket-instance';

import { CollateralReceivedModal } from '../modals/collateral-received/collateral-received';
import { NotEnoughCollateralModal } from '../modals/not-enough-collateral/not-enough-collateral';
import { CreateCreditLine } from '../toasts/create-credit-line/create-credit-line';
import { NotEnoughCollateral } from '../toasts/not-enough-collateral/not-enough-collateral';

import {
  getCollateralDepositState,
  CollateralDepositState,
} from './collateral-deposit-alerts.helpers';

const COLLATERAL_DEPOSITED_HANDLER_ID =
  'CollateralDepositAlerts.ledger-updated';
export const CollateralDepositAlerts: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLedgerResponse = useGetLedger();

  const handleLedgerUpdatedEvent = (event: LedgerUpdatedWsEvent): void => {
    if (event.data.action.type === LedgerActionType.DEPOSIT) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    websocketInstance.addHandler(
      WsEventTopic.LEDGER_UPDATED_TOPIC,
      COLLATERAL_DEPOSITED_HANDLER_ID,
      handleLedgerUpdatedEvent,
    );

    return () => {
      websocketInstance.removeHandler(
        WsEventTopic.LEDGER_UPDATED_TOPIC,
        COLLATERAL_DEPOSITED_HANDLER_ID,
      );
    };
  }, []);

  const collateralText = useMemo(() => {
    if (getLedgerResponse.state === RequestState.SUCCESS) {
      return formatLedgerAccountsToString(getLedgerResponse.data.accounts);
    }
    return '';
  }, [getLedgerResponse]);

  const collateralCreditValue = useMemo(() => {
    if (getLedgerResponse.state === RequestState.SUCCESS) {
      return calculateLedgerCreditValue(getLedgerResponse.data.accounts);
    }

    return '';
  }, [getLedgerResponse]);

  const currentCollateralDepositState = getCollateralDepositState(
    isModalOpen,
    collateralCreditValue,
    getLedgerResponse.state === RequestState.SUCCESS
      ? getLedgerResponse.data.accounts
      : [],
  );

  if (
    currentCollateralDepositState ===
    CollateralDepositState.COLLATERAL_RECEIVED_MODAL
  ) {
    return (
      <CollateralReceivedModal
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={() => {
          setIsModalOpen(false);
        }}
        ledgerValue={collateralCreditValue}
        creditValue={collateralCreditValue}
      />
    );
  }

  if (
    currentCollateralDepositState ===
    CollateralDepositState.NOT_ENOUGH_COLLATERAL_MODAL
  ) {
    return (
      <NotEnoughCollateralModal
        creditValue={collateralCreditValue}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    );
  }

  if (
    currentCollateralDepositState ===
    CollateralDepositState.CREATE_CREDIT_LINE_TOAST
  ) {
    return (
      <CreateCreditLine
        collateralText={collateralText}
        creditValue={collateralCreditValue}
      />
    );
  }

  if (
    currentCollateralDepositState ===
    CollateralDepositState.NOT_ENOUGH_COLLATERAL_TOAST
  ) {
    return <NotEnoughCollateral creditValue={collateralCreditValue} />;
  }

  return <></>;
};
