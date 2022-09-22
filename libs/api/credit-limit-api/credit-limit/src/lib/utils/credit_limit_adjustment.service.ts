import { Injectable, Logger } from '@nestjs/common';
import {
  CalculatedCreditLimit,
  CollateralValue,
  CollateralWithPrice,
  CreditAsset,
} from './utils.interfaces';
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
import { DataSource, InsertResult, Repository, UpdateResult } from 'typeorm';
import { QueueService } from '@archie/api/utils/queue';
import {
  CreditLimitUpdatedPayload,
  CreditLineCreatedPayload,
} from '@archie/api/credit-limit-api/data-transfer-objects';
import {
  CreditAlreadyExistsError,
  CreateCreditMinimumCollateralError,
} from '../credit_limit.errors';
import { CreditLimitAsset } from '../credit_limit_asset.entity';

@Injectable()
export class CreditLimitAdjustmentService {
  private MINIMUM_CREDIT = 200;
  private MAXIMUM_CREDIT = 2000;

  constructor(
    @InjectRepository(CreditLimit)
    private creditLimitRepository: Repository<CreditLimit>,
    @InjectRepository(CreditLimitAsset)
    private creditLimitAssetRepository: Repository<CreditLimitAsset>,
    private queueService: QueueService,
    private dataSource: DataSource,
  ) {}

  public async updateCreditLimit(
    userId: string,
    collateralCalculatedAt: string,
    collateralValue: CollateralValue,
    assetList: AssetList,
  ): Promise<void> {
    const calculatedCreditLimit: CalculatedCreditLimit =
      this.calculateCreditLimit(collateralValue.collateral, assetList);

    const newCreditLimit: number = Math.min(
      calculatedCreditLimit.creditLimit,
      this.MAXIMUM_CREDIT,
    );

    const creditAssetWeight: number =
      newCreditLimit / calculatedCreditLimit.creditLimit;
    const creditPerAssets: CreditAsset[] = calculatedCreditLimit.assets.map(
      (asset) => ({
        credit: asset.credit * creditAssetWeight,
        name: asset.name,
      }),
    );

    const updatedCreditLimit: CreditLimit | undefined =
      await this.updateCreditLimitRecord(
        userId,
        collateralCalculatedAt,
        newCreditLimit,
        collateralValue,
        creditPerAssets,
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
  ): CalculatedCreditLimit {
    return collateralValue.reduce(
      (sum: CalculatedCreditLimit, value: CollateralWithPrice) => {
        const assetInformation: AssetInformation | undefined =
          assetList[value.asset];

        if (assetInformation === undefined) {
          return sum;
        }

        const actualCollateralValue: number =
          (value.price / 100) * assetInformation.ltv;

        const roundAmount = Math.floor(actualCollateralValue);

        return {
          creditLimit: sum.creditLimit + roundAmount,
          assets: [
            ...sum.assets,
            {
              name: value.asset,
              credit: roundAmount,
            },
          ],
        };
      },
      {
        creditLimit: 0,
        assets: [],
      },
    );
  }

  private async updateCreditLimitRecord(
    userId: string,
    collateralCalculatedAt: string,
    newCreditLimit: number,
    collateralValue: CollateralValue,
    creditPerAssets: CreditAsset[],
  ): Promise<CreditLimit | undefined> {
    const creditLimit: CreditLimit | undefined =
      await this.creditLimitRepository
        .createQueryBuilder('CreditLimit')
        .update(CreditLimit)
        .where('userId = :userId AND calculatedAt <= :calculatedAt ', {
          userId: userId,
          calculatedAt: collateralCalculatedAt,
        })
        .set({
          creditLimit: newCreditLimit,
          calculatedOnCollateralBalance: collateralValue.collateralBalance,
          calculatedAt: collateralCalculatedAt,
        })
        .returning('*')
        .execute()
        .then((response: UpdateResult) => {
          return (<CreditLimit[]>response.raw)[0];
        });

    if (creditLimit !== undefined) {
      await this.insertCreditLimitPerAsset(
        creditLimit,
        collateralValue,
        creditPerAssets,
      );
    }

    return creditLimit;
  }

  private async insertCreditLimitPerAsset(
    creditLimit: CreditLimit,
    collateralValue: CollateralValue,
    creditPerAssets: CreditAsset[],
  ): Promise<void> {
    const creditLimitAssets = collateralValue.collateral.map((collateral) => {
      const creditAsset: CreditAsset | undefined = creditPerAssets.find(
        (ca) => ca.name === collateral.asset,
      );

      return {
        credit: creditAsset?.credit ?? 0,
        asset: collateral.asset,
        creditLimit: creditLimit,
      };
    });

    await this.creditLimitAssetRepository.upsert(creditLimitAssets, {
      conflictPaths: ['asset', 'creditLimit'],
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

    let totalCreditValue: CalculatedCreditLimit = this.calculateCreditLimit(
      collateralValue.collateral,
      assetList,
    );

    if (totalCreditValue.creditLimit < this.MINIMUM_CREDIT) {
      throw new CreateCreditMinimumCollateralError(this.MINIMUM_CREDIT);
    }

    if (totalCreditValue.creditLimit > this.MAXIMUM_CREDIT) {
      Logger.warn({
        code: 'CREATE_CREDIT_MAXIMUM_COLLATERAL_VALUE_EXCEEDED',
        metadata: {
          userId,
        },
      });

      const creditAssetWeight: number =
        this.MAXIMUM_CREDIT / totalCreditValue.creditLimit;
      const creditPerAssets: CreditAsset[] = totalCreditValue.assets.map(
        (asset) => ({
          credit: asset.credit * creditAssetWeight,
          name: asset.name,
        }),
      );

      totalCreditValue = {
        creditLimit: this.MAXIMUM_CREDIT,
        assets: creditPerAssets,
      };
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const insertedCreditLimit: CreditLimit =
        await this.creditLimitRepository.save({
          userId,
          calculatedAt: new Date().toISOString(),
          creditLimit: totalCreditValue.creditLimit,
          calculatedOnCollateralBalance: collateralValue.collateralBalance,
        });
      await this.insertCreditLimitPerAsset(
        insertedCreditLimit,
        collateralValue,
        totalCreditValue.assets,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    this.queueService.publish<CreditLineCreatedPayload>(
      CREDIT_LINE_CREATED_TOPIC,
      {
        userId,
        amount: totalCreditValue.creditLimit,
      },
    );
  }
}
