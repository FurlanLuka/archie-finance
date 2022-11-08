import BigNumber from 'bignumber.js';

import { InternalLedgerAccountData } from '@archie/api/ledger-api/data-transfer-objects/types';
import { MIN_LINE_OF_CREDIT } from '@archie/ui/dashboard/constants';

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
  ledgerAccounts: InternalLedgerAccountData[],
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
