import { Injectable, Logger } from '@nestjs/common';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import {
  CollateralValue,
  CollateralWithCalculationDate,
} from './utils.interfaces';
import { CreditLimit } from '../credit_limit.entity';
import {
  CREDIT_LIMIT_DECREASED_TOPIC,
  CREDIT_LIMIT_INCREASED_TOPIC,
} from '@archie/api/credit-limit-api/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Collateral } from '../collateral.entity';
import { In, Repository } from 'typeorm';
import { CollateralValueUtilService } from './collateral_value.service';
import { MathUtilService } from './math.service';
import { QueueService } from '@archie/api/utils/queue';
import { CreditLimitAdjustmentService } from './credit_limit_adjustment.service';

@Injectable()
export class CollateralBalanceUpdateUtilService {
  MINIMUM_COLLATERAL_CHANGE_PERCENTAGE_TO_ADJUST_CREDIT_LIMIT = 10;

  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CreditLimit)
    private creditLimitRepository: Repository<CreditLimit>,
    private collateralValueUtilService: CollateralValueUtilService,
    private mathUtilService: MathUtilService,
    private queueService: QueueService,
    private creditLimitAdjustmentService: CreditLimitAdjustmentService,
  ) {}

  public async handleCollateralBalanceUpdate(userId: string): Promise<void> {
    try {
      const creditLimit: CreditLimit | null =
        await this.creditLimitRepository.findOneBy({
          userId: userId,
        });

      if (creditLimit !== null) {
        const assetPrices: GetAssetPriceResponse[] =
          await this.queueService.request(GET_ASSET_PRICES_RPC);
        const collateral: CollateralWithCalculationDate[] =
          await this.getCollateralWithCalculationDate(userId);
        const collateralValue: CollateralValue =
          this.collateralValueUtilService.getCollateralValue(
            collateral,
            assetPrices,
          );

        const collateralValueChange: number =
          this.mathUtilService.getDifference(
            collateralValue.collateralBalance,
            creditLimit.calculatedOnCollateralBalance,
          );

        if (
          collateralValueChange >=
          this.MINIMUM_COLLATERAL_CHANGE_PERCENTAGE_TO_ADJUST_CREDIT_LIMIT
        ) {
          await this.creditLimitAdjustmentService.updateCreditLimit(
            userId,
            collateral[0].calculatedAt,
            collateralValue,
            assetPrices,
          );
        }
      }
    } catch (error) {
      Logger.error(
        `Error publishing ${CREDIT_LIMIT_INCREASED_TOPIC} or ${CREDIT_LIMIT_DECREASED_TOPIC} event`,
        error,
      );
    }
  }

  public async handlePeriodicCollateralBalanceUpdate(
    userIds: string[],
  ): Promise<void> {
    const creditLimits: CreditLimit[] = await this.creditLimitRepository.findBy(
      {
        userId: In(userIds),
      },
    );
    const assetPrices: GetAssetPriceResponse[] =
      await this.queueService.request(GET_ASSET_PRICES_RPC);
    const collaterals: CollateralWithCalculationDate[] =
      await this.getCollateralWithCalculationDateForManyUsers(userIds);

    await Promise.all(
      userIds.map(async (userId: string) => {
        const creditLimit: CreditLimit | undefined = creditLimits.find(
          (credit: CreditLimit) => credit.userId == userId,
        );
        const collateral: CollateralWithCalculationDate[] = collaterals.filter(
          (coll) => coll.userId === userId,
        );
        if (creditLimit === undefined || collateral.length === 0) {
          return;
        }

        const collateralValue: CollateralValue =
          this.collateralValueUtilService.getCollateralValue(
            collateral,
            assetPrices,
          );

        const collateralValueChange: number =
          this.mathUtilService.getDifference(
            collateralValue.collateralBalance,
            creditLimit.calculatedOnCollateralBalance,
          );

        if (
          collateralValueChange >=
          this.MINIMUM_COLLATERAL_CHANGE_PERCENTAGE_TO_ADJUST_CREDIT_LIMIT
        ) {
          await this.creditLimitAdjustmentService.updateCreditLimit(
            userId,
            collateral[0].calculatedAt,
            collateralValue,
            assetPrices,
          );
        }
      }),
    );
  }

  private async getCollateralWithCalculationDate(
    userId: string,
  ): Promise<CollateralWithCalculationDate[]> {
    return this.collateralRepository
      .createQueryBuilder('Collateral')
      .select('*, now() as "calculatedAt"')
      .where('userId =: userId', {
        userId: userId,
      })
      .getRawMany();
  }

  private async getCollateralWithCalculationDateForManyUsers(
    userIds: string[],
  ): Promise<CollateralWithCalculationDate[]> {
    return this.collateralRepository
      .createQueryBuilder('Collateral')
      .select('*, now() as "calculatedAt"')
      .where('userId IN( : userId )', {
        userId: userIds,
      })
      .getRawMany();
  }
}
