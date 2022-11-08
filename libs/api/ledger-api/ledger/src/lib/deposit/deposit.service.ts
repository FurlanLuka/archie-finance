import { Injectable } from '@nestjs/common';
import { CollateralDepositTransactionCompletedPayload } from '@archie/api/fireblocks-api/data-transfer-objects/types';
import { LedgerService } from '../ledger/ledger.service';
import { AssetInformation, AssetsService } from '@archie/api/ledger-api/assets';
import { InvalidAssetError } from './deposit.errors';
import { LedgerActionType } from '@archie/api/ledger-api/data-transfer-objects/types';

@Injectable()
export class DepositService {
  constructor(private ledgerService: LedgerService, private assetsService: AssetsService) {}

  public async depositHandler({
    userId,
    amount,
    assetId,
  }: CollateralDepositTransactionCompletedPayload): Promise<void> {
    const assetInformation: AssetInformation | undefined = this.assetsService.getAssetInformation(assetId);

    if (assetInformation === undefined) {
      throw new InvalidAssetError({
        userId,
        assetId,
      });
    }

    await this.ledgerService.incrementLedgerAccount(userId, assetInformation, amount, {
      type: LedgerActionType.DEPOSIT,
    });
  }
}
