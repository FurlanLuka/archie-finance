import { Injectable } from '@nestjs/common';
import {
  CollateralWithdrawInitializedDto,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/fireblocks';
import { Collateral } from './collateral.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditLimit } from './credit_limit.entity';
import { CollateralBalanceUpdateUtilService } from './utils/collateral_balance_update.service';
import { CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED } from '@archie/api/credit-limit-api/constants';
import { CollateralDepositCompletedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { QueueService } from '@archie/api/utils/queue';
import { CreditLimitPeriodicCheckRequestedPayload } from '@archie/api/credit-limit-api/data-transfer-objects';

@Injectable()
export class CreditLimitService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CreditLimit)
    private creditLimitRepository: Repository<CreditLimit>,
    private collateralBalanceUpdateUtilService: CollateralBalanceUpdateUtilService,
    private queueService: QueueService,
  ) {}

  public async handleCollateralWithdrawInitializedEvent(
    transaction: CollateralWithdrawInitializedDto,
  ): Promise<void> {
    // TODO: Store transaction ids - no duplicated events (check all queue handlers -common issue) / always publish whole state

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

    await this.collateralBalanceUpdateUtilService.handleCollateralBalanceUpdate(
      transaction.userId,
    );
  }

  public async handleCollateralDepositCompletedEvent(
    transaction: CollateralDepositCompletedPayload,
  ): Promise<void> {
    // TODO: Store transaction ids - no duplicated events

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

    await this.collateralBalanceUpdateUtilService.handleCollateralBalanceUpdate(
      transaction.userId,
    );
  }

  public async handleInternalTransactionCreatedEvent(
    transaction: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    // TODO: Store transaction ids - no duplicated events

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

    await this.collateralBalanceUpdateUtilService.handleCollateralBalanceUpdate(
      transaction.userId,
    );
  }
}
