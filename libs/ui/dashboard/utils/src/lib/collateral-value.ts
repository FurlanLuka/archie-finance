import { BigNumber } from 'bignumber.js';

import { InternalLedgerAccountData } from '@archie/api/ledger-api/data-transfer-objects/types';
import { CollateralAssets } from '@archie/ui/shared/constants';

export const calculateLedgerCreditValue = (
  ledgerAccounts: InternalLedgerAccountData[],
): string => {
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

export const calculateCollateralValue = (
  targetLtv: number,
  creditBalance: number,
  collateralTotalValue: number,
) => {
  const ltv = targetLtv / 100;
  const requiredCollateral = creditBalance / ltv;

  return requiredCollateral - collateralTotalValue;
};

export const formatLedgerAccountsToString = (
  ledgerAccounts: InternalLedgerAccountData[],
): string =>
  ledgerAccounts.reduce((text, ledgerAccount, i) => {
    if (i === 0) {
      return `${ledgerAccount.assetAmount} ${ledgerAccount.assetId}`;
    }

    return `${text}, ${ledgerAccount.assetAmount} ${ledgerAccount.assetId}`;
  }, '');
