import BigNumber from 'bignumber.js';

import { MIN_LINE_OF_CREDIT } from '@archie-microservices/ui/dashboard/constants';
import { LedgerAccountData } from '@archie-microservices/ui/shared/data-access/archie-api-dtos';

export enum CollateralDepositState {
  COLLATERAL_RECEIVED_MODAL = 'collateral_received_modal',
  NOT_ENOUGH_COLLATERAL_MODAL = 'not_enough_collateral_modal',
  CREATE_CREDIT_LINE_TOAST = 'create_credit_line_toast',
  NOT_ENOUGH_COLLATERAL_TOAST = 'not_enough_collateral_toast',
  NONE = 'none',
}

export const getCollateralDepositState = (
  isModalOpen: boolean,
  collateralTotalValue: string,
  ledgerAccounts: LedgerAccountData[],
): CollateralDepositState => {
  if (isModalOpen) {
    if (BigNumber(collateralTotalValue).gt(MIN_LINE_OF_CREDIT)) {
      return CollateralDepositState.COLLATERAL_RECEIVED_MODAL;
    }

    return CollateralDepositState.NOT_ENOUGH_COLLATERAL_MODAL;
  }

  if (!isModalOpen && ledgerAccounts.length > 0) {
    if (BigNumber(collateralTotalValue).gt(MIN_LINE_OF_CREDIT)) {
      return CollateralDepositState.CREATE_CREDIT_LINE_TOAST;
    }

    return CollateralDepositState.NOT_ENOUGH_COLLATERAL_TOAST;
  }

  return CollateralDepositState.NONE;
};
