import { Injectable, Logger } from '@nestjs/common';
import { Collateral } from './collateral.entity';
import {
  DataSource,
  LessThan,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CollateralBalanceUpdateUtilService } from './utils/collateral_balance_update.service';
import { CreditLimitAdjustmentService } from './utils/credit_limit_adjustment.service';
import {
  CalculatedCreditLimit,
  CollateralValue,
} from './utils/utils.interfaces';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { CollateralValueUtilService } from './utils/collateral_value.service';
import { QueueService } from '@archie/api/utils/queue';
import {
  CollateralDepositCompletedPayload,
  CollateralWithdrawInitializedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { AssetList } from '@archie/api/collateral-api/asset-information';
import { GET_ASSET_INFORMATION_RPC } from '@archie/api/collateral-api/constants';
import { DatabaseErrorHandlingService } from './utils/database_error_handling.service';
import { CollateralTransaction } from './collateral_transactions.entity';
import { TransactionStatus } from './credit_limit.interfaces';
import {
  CollateralWithdrawCompletedPayload,
  InternalCollateralTransactionCompletedPayload,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';
import { CreditLimitAsset } from './credit_limit_asset.entity';
import { CreditLimit } from './credit_limit.entity';
import { CreditLineNotFound } from './credit_limit.errors';
import { CreditLimitResponse } from '@archie/api/credit-limit-api/data-transfer-objects';

@Injectable()
export class CreditLimitService {
  NONE = 0;

  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CollateralTransaction)
    private collateralTransactionRepository: Repository<CollateralTransaction>,
    @InjectRepository(CreditLimit)
    private creditLimitRepository: Repository<CreditLimit>,
    private collateralBalanceUpdateUtilService: CollateralBalanceUpdateUtilService,
    private creditLimitAdjustmentService: CreditLimitAdjustmentService,
    private queueService: QueueService,
    private collateralValueUtilService: CollateralValueUtilService,
    private dataSource: DataSource,
    private databaseErrorHandlingService: DatabaseErrorHandlingService,
  ) {}

  public async handleCollateralWithdrawInitializedEvent(
    transaction: CollateralWithdrawInitializedPayload,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.collateralTransactionRepository.insert({
        externalTransactionId: transaction.withdrawalId,
        status: TransactionStatus.initiated,
      });

      await this.collateralRepository.decrement(
        {
          userId: transaction.userId,
          asset: transaction.asset,
        },
        'amount',
        transaction.withdrawalAmount,
      );

      await queryRunner.commitTransaction();
    } catch (e) {
      const error: TypeORMError = e;
      Logger.error('Error updating collateral balance', error);
      await queryRunner.rollbackTransaction();

      return this.databaseErrorHandlingService.ignoreDuplicatedRecordError(
        error,
      );
    } finally {
      await queryRunner.release();
    }

    await this.collateralBalanceUpdateUtilService.handleCollateralBalanceUpdate(
      transaction.userId,
    );
  }

  public async handleCollateralDepositCompletedEvent(
    transaction: CollateralDepositCompletedPayload,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.collateralTransactionRepository.insert({
        externalTransactionId: transaction.transactionId,
        status: TransactionStatus.initiated,
      });

      const updateResult: UpdateResult =
        await this.collateralRepository.increment(
          {
            userId: transaction.userId,
            asset: transaction.asset,
          },
          'amount',
          transaction.amount,
        );

      if (updateResult.affected === this.NONE) {
        await this.collateralRepository.insert({
          userId: transaction.userId,
          amount: transaction.amount,
          asset: transaction.asset,
        });
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      const error: TypeORMError = e;
      Logger.error('Error updating collateral balance', error);
      await queryRunner.rollbackTransaction();

      return this.databaseErrorHandlingService.ignoreDuplicatedRecordError(
        error,
      );
    } finally {
      await queryRunner.release();
    }

    await this.collateralBalanceUpdateUtilService.handleCollateralBalanceUpdate(
      transaction.userId,
    );
  }

  public async handleInternalTransactionCreatedEvent(
    transaction: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.collateralTransactionRepository.insert({
        externalTransactionId: transaction.id,
        status: TransactionStatus.initiated,
      });
      await this.collateralRepository.decrement(
        {
          userId: transaction.userId,
          asset: transaction.asset,
        },
        'amount',
        transaction.amount,
      );
    } catch (e) {
      const error: TypeORMError = e;
      Logger.error('Error updating collateral balance', error);
      await queryRunner.rollbackTransaction();

      return this.databaseErrorHandlingService.ignoreDuplicatedRecordError(
        error,
      );
    } finally {
      await queryRunner.release();
    }

    await this.collateralBalanceUpdateUtilService.handleCollateralBalanceUpdate(
      transaction.userId,
    );
  }

  public async handleTransactionCompletedEvent(
    transaction:
      | InternalCollateralTransactionCompletedPayload
      | CollateralWithdrawCompletedPayload,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.collateralTransactionRepository.insert({
        externalTransactionId: transaction.transactionId,
        status: TransactionStatus.completed,
      });

      const updatedResult: UpdateResult =
        await this.collateralRepository.decrement(
          {
            userId: transaction.userId,
            asset: transaction.asset,
            amount: MoreThanOrEqual(transaction.fee),
          },
          'amount',
          transaction.fee,
        );

      if (updatedResult.affected === 0) {
        await this.collateralRepository.update(
          {
            userId: transaction.userId,
            asset: transaction.asset,
            amount: LessThan(transaction.fee),
          },
          {
            amount: '0',
          },
        );
      }
    } catch (e) {
      const error: TypeORMError = e;
      Logger.error('Error updating collateral balance', error);
      await queryRunner.rollbackTransaction();

      return this.databaseErrorHandlingService.ignoreDuplicatedRecordError(
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async createCredit(userId: string): Promise<CreditLimitResponse> {
    const collateral: Collateral[] = await this.collateralRepository.findBy({
      userId,
    });

    const assetPrices: GetAssetPriceResponse[] =
      await this.queueService.request(GET_ASSET_PRICES_RPC);
    const assetList: AssetList = await this.queueService.request(
      GET_ASSET_INFORMATION_RPC,
    );

    const collateralValue: CollateralValue =
      this.collateralValueUtilService.getCollateralValue(
        collateral,
        assetPrices,
      );

    const creditLimit: CalculatedCreditLimit =
      await this.creditLimitAdjustmentService.createInitialCredit(
        userId,
        collateralValue,
        assetList,
      );

    return {
      limit: creditLimit.creditLimit,
      assets: creditLimit.assets.map((asset) => ({
        asset: asset.name,
        limit: asset.limit,
      })),
    };
  }

  public async getCreditLine(userId: string): Promise<CreditLimitResponse> {
    const creditLimit: CreditLimit | null =
      await this.creditLimitRepository.findOne({
        where: {
          userId,
        },
        relations: {
          creditLimitAssets: true,
        },
      });

    if (creditLimit === null) {
      throw new CreditLineNotFound();
    }

    return {
      limit: creditLimit.creditLimit,
      assets: creditLimit.creditLimitAssets.map((asset) => ({
        asset: asset.asset,
        limit: asset.limit,
      })),
    };
  }
}
