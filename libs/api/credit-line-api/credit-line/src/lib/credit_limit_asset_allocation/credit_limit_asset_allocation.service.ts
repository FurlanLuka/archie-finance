import { Injectable } from '@nestjs/common';
import { CreditLimitAssetAllocation } from '@archie/api/credit-line-api/data-transfer-objects/types';
import { AssetInformation } from '../assets/assets.interfaces';
import { AssetsService } from '../assets/assets.service';
import { CreditLimitAssetAllocationReducerResponse } from '../credit_line/credit_line.interfaces';
import { LedgerAccount } from '../ledger/ledger_account.entity';
import BigNumber from 'bignumber.js';

@Injectable()
export class CreditLimitAssetAllocationService {
  constructor(private assetsService: AssetsService) {}

  public calculate(
    creditLimit: number,
    ledgerAccounts: LedgerAccount[],
  ): CreditLimitAssetAllocation[] {
    const sortedLedgerAccounts: LedgerAccount[] =
      this.sortLedgerAccountsByAssetToCreditUtilizationPercentage(
        ledgerAccounts,
      );

    const creditLimitAssetAllocation = sortedLedgerAccounts.reduce(
      (
        previousValue,
        ledgerAccount,
      ): CreditLimitAssetAllocationReducerResponse => {
        const assetInformation: AssetInformation | undefined =
          this.assetsService.getAssetInformation(ledgerAccount.assetId);

        if (assetInformation === undefined) {
          return previousValue;
        }

        if (previousValue.remaining.eq(0)) {
          return {
            ...previousValue,
            assets: [
              ...previousValue.assets,
              {
                assetId: ledgerAccount.assetId,
                allocatedAssetValue: 0,
                allocationPercentage: 0,
              },
            ],
          };
        }

        const assetCreditLimit = BigNumber(ledgerAccount.value)
          .dividedBy(100)
          .multipliedBy(assetInformation.assetToCreditUtilizationPercentage)
          .decimalPlaces(2, BigNumber.ROUND_DOWN);

        const remaining = previousValue.remaining.minus(assetCreditLimit);

        if (remaining.gte(0)) {
          const allocation = assetCreditLimit
            .dividedBy(creditLimit)
            .multipliedBy(100)
            .decimalPlaces(2, BigNumber.ROUND_CEIL);

          return {
            remaining,
            assets: [
              ...previousValue.assets,
              {
                assetId: ledgerAccount.assetId,
                allocationPercentage: allocation.toNumber(),
                allocatedAssetValue: ledgerAccount.value,
              },
            ],
          };
        } else {
          const allocatedAssetCreditLimit = assetCreditLimit.minus(
            remaining.abs(),
          );

          const allocation = allocatedAssetCreditLimit
            .dividedBy(creditLimit)
            .multipliedBy(100)
            .decimalPlaces(2, BigNumber.ROUND_DOWN);

          return {
            remaining: BigNumber(0),
            assets: [
              ...previousValue.assets,
              {
                assetId: ledgerAccount.assetId,
                allocationPercentage: allocation.toNumber(),
                allocatedAssetValue: allocatedAssetCreditLimit
                  .dividedBy(
                    assetInformation.assetToCreditUtilizationPercentage,
                  )
                  .multipliedBy(100)
                  .decimalPlaces(2, BigNumber.ROUND_DOWN)
                  .toNumber(),
              },
            ],
          };
        }
      },
      {
        assets: [],
        remaining: BigNumber(creditLimit),
      },
    );

    return creditLimitAssetAllocation.assets;
  }

  private sortLedgerAccountsByAssetToCreditUtilizationPercentage(
    ledgerAccounts: LedgerAccount[],
  ): LedgerAccount[] {
    return ledgerAccounts.sort((firstAccount, secondAccount) => {
      const firstAccountAsset: AssetInformation | undefined =
        this.assetsService.getAssetInformation(firstAccount.assetId);

      const secondAccountAsset: AssetInformation | undefined =
        this.assetsService.getAssetInformation(secondAccount.assetId);

      if (firstAccountAsset === undefined || secondAccountAsset === undefined) {
        return 0;
      }

      return (
        secondAccountAsset.assetToCreditUtilizationPercentage -
        firstAccountAsset.assetToCreditUtilizationPercentage
      );
    });
  }
}
