import { Injectable, Logger } from '@nestjs/common';
import {
  CollateralDepositCompletedPayload,
  CollateralWithdrawInitializedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { LtvCollateral } from '../collateral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TypeORMError, UpdateResult } from 'typeorm';
import { LtvUpdatedUtilService } from '../utils/ltv_updated.service';
import { CollateralTransaction } from '../collateral_transactions.entity';
import { DatabaseErrorHandlingService } from '../utils/database_error_handling.service';

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
}
