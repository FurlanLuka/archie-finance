import { Injectable, Logger } from '@nestjs/common';
import { CreditAssetUtilService } from './credit_asset.service';
import { LtvUtilService } from './ltv.service';
import { QueueService } from '@archie/api/utils/queue';
import {
  CollateralValue,
  CreditAssets,
  CreditPerUser,
  MultipleCreditAssets,
} from './utils.interfaces';
import {
  LTV_UPDATED_TOPIC,
  MULTIPLE_LTV_UPDATED_TOPIC,
} from '@archie/api/ltv-api/constants';
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
        creditAssets.credit.utilizationAmount,
        collateralValue.collateralBalance,
      );

      this.queueService.publish<LtvUpdatedPayload>(LTV_UPDATED_TOPIC, {
        userId,
        ltv,
        calculatedOn: {
          utilizedCreditAmount: creditAssets.credit.utilizationAmount,
          collateralBalance: collateralValue.collateralBalance,
          collateral: collateralValue.collateral,
          // TODO: add calculated at
        },
      });
    } catch (error) {
      Logger.error(`Problem publishing ${LTV_UPDATED_TOPIC} event`, error);
    }
  }

  public async publishMultipleLtvUpdatedEvent(
    userIds: string[],
  ): Promise<void> {
    const multipleUserCreditAssets: MultipleCreditAssets =
      await this.creditAssetUtilService.getCreditForMultipleUsers(userIds);

    const updatedLtvs: LtvUpdatedPayload[] =
      multipleUserCreditAssets.creditPerUser.map(
        (creditAssets: CreditPerUser) => {
          const collateralValue: CollateralValue =
            this.collateralValueUtilService.getCollateralValue(
              creditAssets.collateral,
              multipleUserCreditAssets.assetPrices,
            );

          const ltv: number = this.ltvUtilService.calculateLtv(
            creditAssets.credit.utilizationAmount,
            collateralValue.collateralBalance,
          );

          return {
            userId: creditAssets.credit.userId,
            ltv,
            calculatedOn: {
              utilizedCreditAmount: creditAssets.credit.utilizationAmount,
              collateralBalance: collateralValue.collateralBalance,
              collateral: collateralValue.collateral,
              // TODO: add calculated at
            },
          };
        },
      );

    this.queueService.publish<LtvUpdatedPayload[]>(
      MULTIPLE_LTV_UPDATED_TOPIC,
      updatedLtvs,
    );
  }
}
