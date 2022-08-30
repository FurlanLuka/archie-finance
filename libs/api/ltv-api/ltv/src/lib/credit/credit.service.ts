import { Injectable } from '@nestjs/common';
import {
  CollateralDepositCompletedPayload,
  CollateralWithdrawInitializedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Collateral } from '@archie/api/credit-api/collateral';
import { LtvCredit } from '../credit.entity';

@Injectable()
export class CreditService {
  NONE = 0;

  constructor(
    @InjectRepository(LtvCredit)
    private ltvCollateralRepository: Repository<LtvCredit>,
  ) {}

  public async handleCollateralWithdrawInitializedEvent(
    transaction: CollateralWithdrawInitializedPayload,
  ): Promise<void> {
    await this.ltvCollateralRepository
      .createQueryBuilder('LtvCollateral')
      .update(Collateral)
      .where('userId =: userId AND asset =: asset', {
        userId: transaction.userId,
        asset: transaction.asset,
      })
      .set({
        amount: () => '"amount" -: amount',
      })
      .setParameter('amount', transaction.withdrawalAmount)
      .execute();
  }

  public async handleCollateralDepositCompletedEvent(
    transaction: CollateralDepositCompletedPayload,
  ): Promise<void> {
    const updateResult: UpdateResult = await this.ltvCollateralRepository
      .createQueryBuilder('LtvCollateral')
      .update(Collateral)
      .where('userId =: userId AND asset =: asset', {
        userId: transaction.userId,
        asset: transaction.asset,
      })
      .set({
        amount: () => '"amount" +: amount',
      })
      .setParameter('amount', transaction.amount)
      .execute();

    if (updateResult.affected === this.NONE) {
      await this.ltvCollateralRepository.insert({
        userId: transaction.userId,
        amount: transaction.amount,
        asset: transaction.asset,
      });
    }
  }
}
