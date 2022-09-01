import { Injectable } from '@nestjs/common';
import { CollateralValue, CollateralWithPrice } from './utils.interfaces';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';
import { CreditLimit } from '../credit_limit.entity';
import {
  CREDIT_LIMIT_DECREASED_TOPIC,
  CREDIT_LIMIT_INCREASED_TOPIC,
} from '@archie/api/credit-limit-api/constants';
import { AssetInformation } from '@archie/api/collateral-api/asset-information';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueService } from '@archie/api/utils/queue';

@Injectable()
export class CreditLimitAdjustmentService {
  constructor(
    @InjectRepository(CreditLimit)
    private creditLimitRepository: Repository<CreditLimit>,
    private queueService: QueueService,
  ) {}

  public async updateCreditLimit(
    userid: string,
    collateralCalculatedAt: string,
    collateralValue: CollateralValue,
    assetPrices: GetAssetPriceResponse[],
  ): Promise<void> {
    const newCreditLimit: number = this.calculateCreditLimit(
      collateralValue.collateral,
      assetPrices,
    );

    const updatedCreditLimit: CreditLimit = await this.updateCreditLimitRecord(
      userid,
      collateralCalculatedAt,
      newCreditLimit,
      collateralValue.collateralBalance,
    );

    if (
      updatedCreditLimit.creditLimit > updatedCreditLimit.previousCreditLimit
    ) {
      this.queueService.publish(CREDIT_LIMIT_INCREASED_TOPIC, {
        newCreditLimit: newCreditLimit,
      });
    } else {
      this.queueService.publish(CREDIT_LIMIT_DECREASED_TOPIC, {
        newCreditLimit: newCreditLimit,
      });
    }
  }

  private calculateCreditLimit(
    collateralValue: CollateralWithPrice[],
    assetList: GetAssetPriceResponse[],
  ): number {
    return collateralValue.reduce((sum: number, value: CollateralWithPrice) => {
      const assetInformation: AssetInformation | undefined =
        assetList[value.asset];

      if (assetInformation === undefined) {
        return sum;
      }

      const actualCollateralValue: number =
        (value.price / 100) * assetInformation.ltv;

      return sum + Math.floor(actualCollateralValue);
    }, 0);
  }

  private async updateCreditLimitRecord(
    userId: string,
    collateralCalculatedAt: string,
    newCreditLimit: number,
    collateralBalance: number,
  ): Promise<CreditLimit> {
    return this.creditLimitRepository
      .createQueryBuilder('CreditLimit')
      .update(CreditLimit)
      .where('userId =: userId AND calculatedAt <=: calculatedAt ', {
        userId: userId,
        calculatedAt: collateralCalculatedAt,
      })
      .set({
        previousCreditLimit: () => 'creditLimit',
        creditLimit: newCreditLimit,
        calculatedOnCollateralBalance: collateralBalance,
        calculatedAt: collateralCalculatedAt,
      })
      .returning('*')
      .execute()
      .then((response) => {
        return (<CreditLimit[]>response.raw)[0];
      });
  }
}
