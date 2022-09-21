import { Injectable, Logger } from '@nestjs/common';
import {
  CollateralDepositCompletedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { LtvCollateral } from '../collateral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  LessThan,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
  UpdateResult,
} from 'typeorm';
import { LtvUpdatedUtilService } from '../utils/ltv_updated.service';
import { CollateralTransaction } from '../collateral_transactions.entity';
import { DatabaseErrorHandlingService } from '../utils/database_error_handling.service';
import {
  CollateralWithdrawCompletedPayload,
  InternalCollateralTransactionCompletedPayload,
  CollateralWithdrawInitializedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';
import { TransactionStatus } from '../lib.interfaces';

@Injectable()
export class CollateralService {
  NONE = 0;

  constructor(
    @InjectRepository(LtvCollateral)
    private ltvCollateralRepository: Repository<LtvCollateral>,
    @InjectRepository(CollateralTransaction)
    private collateralTransaction: Repository<CollateralTransaction>,
    private ltvUpdatedUtilService: LtvUpdatedUtilService,
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
      await this.collateralTransaction.insert({
        externalTransactionId: transaction.withdrawalId,
        status: TransactionStatus.initiated,
      });

      await this.ltvCollateralRepository.decrement(
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

    await this.ltvUpdatedUtilService.publishLtvUpdatedEvent(transaction.userId);
  }

  public async handleCollateralDepositCompletedEvent(
    transaction: CollateralDepositCompletedPayload,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.collateralTransaction.insert({
        externalTransactionId: transaction.transactionId,
        status: TransactionStatus.initiated,
      });

      const updateResult: UpdateResult =
        await this.ltvCollateralRepository.increment(
          {
            userId: transaction.userId,
            asset: transaction.asset,
          },
          'amount',
          transaction.amount,
        );

      if (updateResult.affected === this.NONE) {
        await this.ltvCollateralRepository.insert({
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

    await this.ltvUpdatedUtilService.publishLtvUpdatedEvent(transaction.userId);
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
      await this.collateralTransaction.insert({
        externalTransactionId: transaction.transactionId,
        status: TransactionStatus.completed,
      });

      const updatedResult: UpdateResult =
        await this.ltvCollateralRepository.decrement(
          {
            userId: transaction.userId,
            asset: transaction.asset,
            amount: MoreThanOrEqual(transaction.fee),
          },
          'amount',
          transaction.fee,
        );

      if (updatedResult.affected === 0) {
        await this.ltvCollateralRepository.update(
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
  }
}
