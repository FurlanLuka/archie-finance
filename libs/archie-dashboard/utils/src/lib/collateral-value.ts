import { BigNumber } from 'bignumber.js';

import { TARGET_LTV } from '@archie-webapps/archie-dashboard/constants';
import { CollateralAssets } from '@archie-webapps/shared/constants';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { Ledger, LedgerAccountData } from '@archie-webapps/shared/data-access/archie-api/ledger/api/get-ledger';

export const calculateCollateralTotalValue = (collateral: CollateralValue[]): number =>
  collateral.reduce((sum, collateralEntry) => sum + collateralEntry.price, 0);

export const calculateLedgerCreditValue = (ledger: Ledger): string => {
  const result = ledger.accounts.reduce((sum, ledgerAccount) => {
    const assetInfo = CollateralAssets[ledgerAccount.assetId];

    if (!assetInfo) {
      console.warn('Missing asset info', { assetInfo, ledgerAccount });

      return sum;
    }

    const entryValue = BigNumber(ledgerAccount.accountValue)
      .multipliedBy(assetInfo.loan_to_value / 100)
      .decimalPlaces(2, BigNumber.ROUND_DOWN);

    return sum.plus(entryValue);
  }, BigNumber(0));

  return result.toString();
};

export const calculateCollateralMinValue = (creditBalance: number, collateralTotalValue: number): number => {
  const ltv = TARGET_LTV / 100;

  return (creditBalance - ltv * collateralTotalValue) / (1 - ltv);
};

export const formatLedgerAccountsToString = (ledgerAccounts: LedgerAccountData[]): string =>
  ledgerAccounts.reduce((text, ledgerAccount, i) => {
    if (i === 0) {
      return `${ledgerAccount.assetAmount} ${ledgerAccount.assetId}`;
    }

    return `${text}, ${ledgerAccount.assetAmount} ${ledgerAccount.assetId}`;
  }, '');
