import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, Repository, TypeORMError } from 'typeorm';
import { LtvCredit } from '../credit.entity';
import {
  CreditBalanceUpdatedPayload,
  PaymentType,
} from '@archie/api/peach-api/data-transfer-objects';
import { LtvCollateral } from '../collateral.entity';
import { CreditLineCreatedPayload } from '@archie/api/credit-limit-api/data-transfer-objects';
import { DateTime } from 'luxon';
import { LtvUpdatedUtilService } from '../utils/ltv_updated.service';
import { CollateralTransaction } from '../collateral_transactions.entity';
import { DatabaseErrorHandlingService } from '../utils/database_error_handling.service';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(LtvCredit)
    private ltvCreditRepository: Repository<LtvCredit>,
    @InjectRepository(LtvCollateral)
    private ltvCollateralRepository: Repository<LtvCollateral>,
    @InjectRepository(CollateralTransaction)
    private collateralTransaction: Repository<CollateralTransaction>,
    private ltvUpdatedUtilService: LtvUpdatedUtilService,
    private dataSource: DataSource,
    private databaseErrorHandlingService: DatabaseErrorHandlingService,
  ) {}

  public async handleCreditBalanceUpdatedEvent(
    credit: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    Logger.log('Credit balance updated event received', {
      payload: credit,
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        LtvCredit,
        {
          userId: credit.userId,
          calculatedAt: LessThan(credit.calculatedAt),
        },
        {
          utilizationAmount: credit.utilizationAmount,
          calculatedAt: credit.calculatedAt,
        },
      );

      if (credit.paymentDetails?.type === PaymentType.liquidation) {
        await this.collateralTransaction.insert({
          externalTransactionId: credit.paymentDetails.id,
        });
        await queryRunner.manager.decrement(
          LtvCollateral,
          {
            userId: credit.userId,
            asset: credit.paymentDetails.asset,
          },
          'amount',
          credit.paymentDetails.amount,
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

    await this.ltvUpdatedUtilService.publishLtvUpdatedEvent(credit.userId);
  }

  public async handleCreditLineCreatedEvent({
    userId,
  }: CreditLineCreatedPayload): Promise<void> {
    await this.ltvCreditRepository.insert({
      userId,
      calculatedAt: DateTime.now().toISO(),
      utilizationAmount: 0,
    });
  }
}
