import { Injectable, Logger } from '@nestjs/common';
import { CollateralValue, CollateralWithPrice } from './utils.interfaces';
import { CreditLimit } from '../credit_limit.entity';
import {
  CREDIT_LIMIT_DECREASED_TOPIC,
  CREDIT_LIMIT_INCREASED_TOPIC,
  CREDIT_LINE_CREATED_TOPIC,
} from '@archie/api/credit-limit-api/constants';
import {
  AssetInformation,
  AssetList,
} from '@archie/api/collateral-api/asset-information';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { QueueService } from '@archie/api/utils/queue';
import {
  CreditLimitDecreasedPayload,
  CreditLimitIncreasedPayload,
  CreditLineCreatedPayload,
} from '@archie/api/credit-limit-api/data-transfer-objects';
import {
  CreditAlreadyExistsError,
  CreateCreditMinimumCollateralError,
} from '../credit_limit.errors';

@Injectable()
export class CreditLimitAdjustmentService {
  private MINIMUM_CREDIT = 200;
  private MAXIMUM_CREDIT = 2000;

  constructor(
    @InjectRepository(CreditLimit)
    private creditLimitRepository: Repository<CreditLimit>,
    private queueService: QueueService,
  ) {}

  public async updateCreditLimit(
    userId: string,
    collateralCalculatedAt: string,
    collateralValue: CollateralValue,
    assetList: AssetList,
  ): Promise<void> {
    const newCreditLimit: number = this.calculateCreditLimit(
      collateralValue.collateral,
      assetList,
    );

    const updatedCreditLimit: CreditLimit | undefined =
      await this.updateCreditLimitRecord(
        userId,
        collateralCalculatedAt,
        newCreditLimit,
        collateralValue.collateralBalance,
      );

    if (updatedCreditLimit === undefined) {
      return;
    }

    if (
      updatedCreditLimit.creditLimit > updatedCreditLimit.previousCreditLimit
    ) {
      this.queueService.publish<CreditLimitIncreasedPayload>(
        CREDIT_LIMIT_INCREASED_TOPIC,
        {
          userId,
          creditLimit: newCreditLimit,
          amount:
            updatedCreditLimit.creditLimit -
            updatedCreditLimit.previousCreditLimit,
          calculatedAt: collateralCalculatedAt,
        },
      );
    } else {
      this.queueService.publish<CreditLimitDecreasedPayload>(
        CREDIT_LIMIT_DECREASED_TOPIC,
        {
          userId,
          creditLimit: newCreditLimit,
          amount:
            updatedCreditLimit.previousCreditLimit -
            updatedCreditLimit.creditLimit,
          calculatedAt: collateralCalculatedAt,
        },
      );
    }
  }

  private calculateCreditLimit(
    collateralValue: CollateralWithPrice[],
    assetList: AssetList,
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
  ): Promise<CreditLimit | undefined> {
    return this.creditLimitRepository
      .createQueryBuilder('CreditLimit')
      .update(CreditLimit)
      .where('userId = :userId AND calculatedAt <= :calculatedAt ', {
        userId: userId,
        calculatedAt: collateralCalculatedAt,
      })
      .set({
        previousCreditLimit: () => '"creditLimit"',
        creditLimit: newCreditLimit,
        calculatedOnCollateralBalance: collateralBalance,
        calculatedAt: collateralCalculatedAt,
      })
      .returning('*')
      .execute()
      .then((response: UpdateResult) => {
        return (<CreditLimit[]>response.raw)[0];
      });
  }

  public async createInitialCredit(
    userId: string,
    collateralValue: CollateralValue,
    assetPrices: GetAssetPriceResponse[],
  ): Promise<void> {
    const creditLimit: CreditLimit | null =
      await this.creditLimitRepository.findOneBy({
        userId,
      });

    if (creditLimit !== null) {
      throw new CreditAlreadyExistsError();
    }

    let totalCreditValue: number = this.calculateCreditLimit(
      collateralValue.collateral,
      assetPrices,
    );

    if (totalCreditValue < this.MINIMUM_CREDIT) {
      throw new CreateCreditMinimumCollateralError(this.MINIMUM_CREDIT);
    }

    if (totalCreditValue > this.MAXIMUM_CREDIT) {
      Logger.warn({
        code: 'CREATE_CREDIT_MAXIMUM_COLLATERAL_VALUE_EXCEEDED',
        metadata: {
          userId,
        },
      });

      totalCreditValue = this.MAXIMUM_CREDIT;
    }

    await this.creditLimitRepository.insert({
      userId,
      calculatedAt: new Date().toISOString(),
      creditLimit: totalCreditValue,
      calculatedOnCollateralBalance: collateralValue.collateralBalance,
    });

    this.queueService.publish<CreditLineCreatedPayload>(
      CREDIT_LINE_CREATED_TOPIC,
      {
        userId,
        amount: totalCreditValue,
      },
    );
  }
}
