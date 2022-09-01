import { Injectable, Logger } from '@nestjs/common';
import { CreditAssetUtilService } from './credit_asset.service';
import { LtvUtilService } from './ltv.service';
import { QueueService } from '@archie/api/utils/queue';
import { CollateralValue, CreditAssets } from './utils.interfaces';
import { LTV_UPDATED_TOPIC } from '@archie/api/ltv-api/constants';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { CollateralValueUtilService } from './collateral_value.service';

@Injectable()
export class LtvUpdatedUtilService {
  constructor(
    private creditAssetUtilService: CreditAssetUtilService,
    private ltvUtilService: LtvUtilService,
    private queueService: QueueService,
    private collateralValueUtilService: CollateralValueUtilService,
  ) {}
  public async publishLtvUpdatedEvent(userId: string): Promise<void> {
    try {
      const creditAssets: CreditAssets =
        await this.creditAssetUtilService.getCreditInfo(userId);
      const collateralValue: CollateralValue =
        this.collateralValueUtilService.getCollateralValue(
          creditAssets.collateral,
          creditAssets.assetPrices,
        );

      const ltv: number = this.ltvUtilService.calculateLtv(
        creditAssets,
        collateralValue.collateralBalance,
      );

      this.queueService.publish<LtvUpdatedPayload>(LTV_UPDATED_TOPIC, {
        userId,
        ltv,
        calculatedOn: {
          utilizedCreditAmount: creditAssets.credit.utilizationAmount,
          collateralBalance: collateralValue.collateralBalance,
          collateral: collateralValue.collateral,
        },
      });
    } catch (error) {
      Logger.error(`Problem publishing ${LTV_UPDATED_TOPIC} event`, error);
    }
  }
}
