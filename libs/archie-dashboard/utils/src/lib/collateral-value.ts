// TODO move to shared? it's used for calculation in events
import { BigNumber } from 'bignumber.js';

import { CollateralAssets } from '@archie-webapps/shared/constants';
import { LedgerAccountData } from '@archie-webapps/shared/data-access/archie-api-dtos';

export const calculateLedgerCreditValue = (ledgerAccounts: LedgerAccountData[]): string => {
  const result = ledgerAccounts.reduce((sum, ledgerAccount) => {
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

export const calculateCollateralValue = (targetLtv: number, creditBalance: number, collateralTotalValue: number) => {
  const ltv = targetLtv / 100;
  const requiredCollateral = creditBalance / ltv;

  return requiredCollateral - collateralTotalValue;
};

export const formatLedgerAccountsToString = (ledgerAccounts: LedgerAccountData[]): string =>
  ledgerAccounts.reduce((text, ledgerAccount, i) => {
    if (i === 0) {
      return `${ledgerAccount.assetAmount} ${ledgerAccount.assetId}`;
    }

    return `${text}, ${ledgerAccount.assetAmount} ${ledgerAccount.assetId}`;
  }, '');
