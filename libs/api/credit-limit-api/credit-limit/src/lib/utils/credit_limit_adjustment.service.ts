import { Injectable, Logger } from '@nestjs/common';
import { CollateralValue, CollateralWithPrice } from './utils.interfaces';
import { CreditLimit } from '../credit_limit.entity';
import {
  CREDIT_LIMIT_UPDATED_TOPIC,
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
  CreditLimitUpdatedPayload,
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
    const newCreditLimit: number = Math.min(
      this.calculateCreditLimit(collateralValue.collateral, assetList),
      this.MAXIMUM_CREDIT,
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

    this.queueService.publish<CreditLimitUpdatedPayload>(
      CREDIT_LIMIT_UPDATED_TOPIC,
      {
        userId,
        creditLimit: newCreditLimit,
        calculatedAt: collateralCalculatedAt,
      },
    );
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
    assetList: AssetList,
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
      assetList,
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

    const calculatedAt = new Date().toISOString();
    await this.creditLimitRepository.insert({
      userId,
      calculatedAt,
      creditLimit: totalCreditValue,
      calculatedOnCollateralBalance: collateralValue.collateralBalance,
    });

    this.queueService.publish<CreditLineCreatedPayload>(
      CREDIT_LINE_CREATED_TOPIC,
      {
        userId,
        amount: totalCreditValue,
        calculatedAt,
        downPayment: collateralValue.collateralBalance,
      },
    );
  }
}
