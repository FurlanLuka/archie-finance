import { Injectable } from '@nestjs/common';
import {
  InitiateLedgerAssetLiquidationCommandPayload,
  InternalLedgerAccountData,
  Ledger,
} from '@archie/api/ledger-api/data-transfer-objects';
import { LedgerService } from '../ledger/ledger.service';
import { AssetList, AssetsService } from '@archie/api/ledger-api/assets';
import { AssetInformation } from '@archie/api/ledger-api/assets';
import BigNumber from 'bignumber.js';

interface LiquidatedAccounts {
  assetId: string;
  amount: string;
}

interface AccountsLiquidationReducer {
  amountLeftToLiquidate: string;
  accountsToLiquidate: LiquidatedAccounts[];
}

@Injectable()
export class LiquidationService {
  constructor(
    private ledgerService: LedgerService,
    private assetsService: AssetsService,
  ) {}

  public async initiateLedgerAssetLiquidation({
    userId,
    amount,
  }: InitiateLedgerAssetLiquidationCommandPayload): Promise<void> {
    const ledger: Ledger = await this.ledgerService.getLedger(userId);

    const assetList: AssetList = this.assetsService.getSupportedAssetList();

    const sortedLedgerAccounts: InternalLedgerAccountData[] =
      ledger.accounts.sort((firstAccount, secondAccount) => {
        const firstAccountAsset: AssetInformation | undefined = assetList.find(
          (asset) => asset.id === firstAccount.assetId,
        );

        const secondAccountAsset: AssetInformation | undefined = assetList.find(
          (asset) => asset.id === secondAccount.assetId,
        );

        if (
          firstAccountAsset === undefined ||
          secondAccountAsset === undefined
        ) {
          return 0;
        }

        return (
          firstAccountAsset.liquidationWeight -
          secondAccountAsset.liquidationWeight
        );
      });

    const accountsLiquidationReducerResult = sortedLedgerAccounts.reduce(
      (previousValue, ledgerAccount): AccountsLiquidationReducer => {
        if (BigNumber(previousValue.amountLeftToLiquidate).eq(0)) {
          return previousValue;
        }

        const newLedgerAccountValue = BigNumber(
          ledgerAccount.accountValue,
        ).minus(previousValue.amountLeftToLiquidate);

        if (newLedgerAccountValue.gte(0)) {
          const amountToTake = BigNumber(ledgerAccount.accountValue)
            .minus(newLedgerAccountValue)
            .dividedBy(ledgerAccount.assetPrice);

          return {
            amountLeftToLiquidate: '0',
            accountsToLiquidate: [
              ...previousValue.accountsToLiquidate,
              {
                assetId: ledgerAccount.assetId,
                amount: amountToTake.toString(),
              },
            ],
          };
        } else {
          const amountLeftToLiquidate = newLedgerAccountValue.abs();

          return {
            amountLeftToLiquidate: amountLeftToLiquidate.toString(),
            accountsToLiquidate: [
              ...previousValue.accountsToLiquidate,
              {
                assetId: ledgerAccount.assetId,
                amount: ledgerAccount.assetAmount,
              },
            ],
          };
        }
      },
      {
        amountLeftToLiquidate: amount,
        accountsToLiquidate: [],
      },
    );

    await this.ledgerService.batchDecrementLedgerAccounts(
      userId,
      accountsLiquidationReducerResult.accountsToLiquidate,
    );
  }
}
