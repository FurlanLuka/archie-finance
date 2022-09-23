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
  CreditLimitResponse,
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
        limit: asset.limit * creditAssetWeight,
        name: asset.name,
      }),
    );

    const updatedCreditLimit: CreditLimit | undefined =
      await this.updateCreditLimitRecord(
        userId,
        collateralCalculatedAt,
        newCreditLimit,
        collateralValue.collateralBalance,
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
    userId: string,
  ): CalculatedCreditLimit {
    const creditLimit = collateralValue.reduce(
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
              limit: roundAmount,
            },
          ],
        };
      },
      {
        creditLimit: 0,
        assets: [],
      },
    );

    if (creditLimit.creditLimit > this.MAXIMUM_CREDIT) {
      Logger.warn({
        code: 'CREATE_CREDIT_MAXIMUM_COLLATERAL_VALUE_EXCEEDED',
        metadata: {
          userId,
        },
      });

      // TODO: recalculate credit limit + asset credit limit
      const sortedCreditAssetsByLimit: CreditAsset[] = creditLimit.assets
        .slice()
        .sort((a, b) => (a.limit >= b.limit ? -1 : 1));

      sortedCreditAssetsByLimit.reduce(
        (creditAssets: any, value: CreditAsset) => {
          if (creditAssets.targetLimit === 0) {
            return {
              targetLimit: 0,
              assets: [
                ...creditAssets.assets,
                {
                  name: value.name,
                  limit: 0,
                },
              ],
            };
          }

          return {
            targetLimit:
              creditAssets.targetLimit > value.limit
                ? creditAssets.targetLimit - value.limit
                : 0,
            assets: [
              ...creditAssets.assets,
              {
                name: value.name,
                limit:
                  creditAssets.targetLimit > value.limit
                    ? value.limit
                    : creditAssets.targetLimit,
              },
            ],
          };
        },
        {
          targetLimit: this.MAXIMUM_CREDIT,
          assets: [],
        },
      );
    }

    return creditLimit;
  }

  private async updateCreditLimitRecord(
    userId: string,
    collateralCalculatedAt: string,
    newCreditLimit: number,
    collateralBalance: number,
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
          calculatedOnCollateralBalance: collateralBalance,
          calculatedAt: collateralCalculatedAt,
        })
        .returning('*')
        .execute()
        .then((response: UpdateResult) => {
          return (<CreditLimit[]>response.raw)[0];
        });

    if (creditLimit !== undefined) {
      await this.insertCreditLimitPerAsset(creditLimit, creditPerAssets);
    }

    return creditLimit;
  }

  private async insertCreditLimitPerAsset(
    creditLimit: CreditLimit,
    creditPerAssets: CreditAsset[],
  ): Promise<void> {
    const creditLimitAssets = creditPerAssets.map((creditAsset) => ({
      limit: creditAsset.limit,
      asset: creditAsset.name,
      creditLimit: creditLimit,
    }));

    await this.creditLimitAssetRepository.upsert(creditLimitAssets, {
      conflictPaths: ['asset', 'creditLimit'],
    });
  }

  public async createInitialCredit(
    userId: string,
    collateralValue: CollateralValue,
    assetList: AssetList,
  ): Promise<CalculatedCreditLimit> {
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

      // TODO: figure this out (percentage based / allocation based) & add test
      const creditAssetWeight: number =
        this.MAXIMUM_CREDIT / totalCreditValue.creditLimit;
      totalCreditValue = {
        creditLimit: this.MAXIMUM_CREDIT,
        assets: totalCreditValue.assets.map((asset) => ({
          limit: asset.limit * creditAssetWeight,
          name: asset.name,
        })),
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

    return totalCreditValue;
  }
}
