import { Injectable } from '@nestjs/common';
import {
  CollateralDepositCompletedPayload,
  CollateralWithdrawInitializedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { LtvCollateral } from '../collateral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { LtvUpdatedUtilService } from '../utils/ltv_updated.service';

@Injectable()
export class CollateralService {
  NONE = 0;

  constructor(
    @InjectRepository(LtvCollateral)
    private ltvCollateralRepository: Repository<LtvCollateral>,
    private ltvUpdatedUtilService: LtvUpdatedUtilService,
  ) {}

  public async handleCollateralWithdrawInitializedEvent(
    transaction: CollateralWithdrawInitializedPayload,
  ): Promise<void> {
<<<<<<< HEAD
    await this.ltvCollateralRepository
      .createQueryBuilder('LtvCollateral')
      .update(LtvCollateral)
      .where('userId = :userId AND asset = :asset', {
        userId: transaction.userId,
        asset: transaction.asset,
      })
      .set({
        amount: () => '"amount" - :amount',
      })
      .setParameter('amount', transaction.withdrawalAmount)
      .execute();
=======
    // TODO: Store transaction ids - no duplicated events

    await this.ltvCollateralRepository.decrement(
      {
        userId: transaction.userId,
        asset: transaction.asset,
      },
      'amount',
      transaction.withdrawalAmount,
    );
>>>>>>> credit-limit-api

    await this.ltvUpdatedUtilService.publishLtvUpdatedEvent(transaction.userId);
  }

  public async handleCollateralDepositCompletedEvent(
    transaction: CollateralDepositCompletedPayload,
  ): Promise<void> {
<<<<<<< HEAD
    const updateResult: UpdateResult = await this.ltvCollateralRepository
      .createQueryBuilder('LtvCollateral')
      .update(LtvCollateral)
      .where('userId = :userId AND asset = :asset', {
        userId: transaction.userId,
        asset: transaction.asset,
      })
      .set({
        amount: () => '"amount" + :amount',
      })
      .setParameter('amount', transaction.amount)
      .execute();
=======
    // TODO: Store transaction ids - no duplicated events

    await this.ltvCollateralRepository.increment(
      {
        userId: transaction.userId,
        asset: transaction.asset,
      },
      'amount',
      transaction.amount,
    );
>>>>>>> credit-limit-api

    if (updateResult.affected === this.NONE) {
      await this.ltvCollateralRepository.insert({
        userId: transaction.userId,
        amount: transaction.amount,
        asset: transaction.asset,
      });
    }

    await this.ltvUpdatedUtilService.publishLtvUpdatedEvent(transaction.userId);
  }
}
