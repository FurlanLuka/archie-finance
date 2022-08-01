import { MIN_LINE_OF_CREDIT } from '@archie-webapps/archie-dashboard/constants';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';

export enum CollateralDepositState {
  COLLATERAL_RECEIVED_MODAL = 'collateral_received_modal',
  NOT_ENOUGH_COLLATERAL_MODAL= 'not_enough_collateral_modal',
  CREATE_CREDIT_LINE_TOAST = 'create_credit_line_toast',
  NOT_ENOUGH_COLLATERAL_TOAST = 'not_enough_collateral_toast',
  NONE = 'none'
} 

export const getCollateralDepositState = (
  isModalOpen: boolean, 
  collateralTotalValue: number, 
  currentCollateral: CollateralValue[]
): CollateralDepositState => {
  if (isModalOpen) {
    if (collateralTotalValue > MIN_LINE_OF_CREDIT) {
      return CollateralDepositState.COLLATERAL_RECEIVED_MODAL
    }

    return CollateralDepositState.NOT_ENOUGH_COLLATERAL_MODAL
  }

  if (!isModalOpen && currentCollateral.length > 0) {
    if (collateralTotalValue > MIN_LINE_OF_CREDIT) {
      return CollateralDepositState.CREATE_CREDIT_LINE_TOAST
    }  

    return CollateralDepositState.NOT_ENOUGH_COLLATERAL_TOAST
  }  

  return CollateralDepositState.NONE
}

export const formatEntireCollateral = (collateral: CollateralValue[]): string => 
  collateral.reduce((text, collateralEntry, i) => {
    if (i === 0) {
      return `${collateralEntry.assetAmount} ${collateralEntry.asset}`;
    }

    return `${text}, ${collateralEntry.assetAmount} ${collateralEntry.asset}`;
  }, '');