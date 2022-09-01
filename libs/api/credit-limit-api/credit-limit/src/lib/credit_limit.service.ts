import { Injectable } from '@nestjs/common';
import {
  CollateralWithdrawInitializedDto,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/fireblocks';
import { CollateralDepositCompletedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { Collateral } from './collateral.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreditLimitService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
  ) {}

  public async handleCollateralWithdrawInitializedEvent(
    transaction: CollateralWithdrawInitializedDto,
  ): Promise<void> {
    // Get previous collateral check

    await this.collateralRepository
      .createQueryBuilder('Collateral')
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

    // Check if collateral value changed by 10 % - if yes publish credit limit updated event
  }

  public async handleCollateralDepositCompletedEvent(
    transaction: CollateralDepositCompletedPayload,
  ): Promise<void> {
    await this.collateralRepository
      .createQueryBuilder('Collateral')
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

    // Check if collateral value changed by 10 % - if yes publish credit limit updated event
  }

  public async handleInternalTransactionCreatedEvent(
    transaction: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    await this.collateralRepository
      .createQueryBuilder('Collateral')
      .update(Collateral)
      .where('userId =: userId AND asset =: asset', {
        userId: transaction.userId,
        asset: transaction.asset,
      })
      .set({
        amount: () => '"amount" -: amount',
      })
      .setParameter('amount', transaction.amount)
      .execute();

    // Check if collateral value changed by 10 % - if yes publish credit limit updated event}
  }
}
