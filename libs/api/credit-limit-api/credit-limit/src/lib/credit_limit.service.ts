import { Injectable } from '@nestjs/common';
import {
  CollateralWithdrawInitializedDto,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/fireblocks';
import { CollateralDepositCompletedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { Collateral } from './collateral.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditLimit } from './credit_limit.entity';
import { CollateralBalanceUpdateUtilService } from './utils/collateral_balance_update.service';
import { CreditLimitAdjustmentService } from './utils/credit_limit_adjustment.service';
import { CollateralValue } from './utils/utils.interfaces';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { CollateralValueUtilService } from './utils/collateral_value.service';

@Injectable()
export class CreditLimitService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CreditLimit)
    private collateralBalanceUpdateUtilService: CollateralBalanceUpdateUtilService,
    private creditLimitAdjustmentService: CreditLimitAdjustmentService,
    private queueService: QueueService,
    private collateralValueUtilService: CollateralValueUtilService,
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

  public async createCredit(userId: string): Promise<void> {
    const collateral: Collateral[] = await this.collateralRepository.findBy({
      userId,
    });

    const assetPrices: GetAssetPriceResponse[] =
      await this.queueService.request(GET_ASSET_PRICES_RPC);

    const collateralValue: CollateralValue =
      this.collateralValueUtilService.getCollateralValue(
        collateral,
        assetPrices,
      );

    return this.creditLimitAdjustmentService.createInitialCredit(
      userId,
      collateralValue,
      assetPrices,
    );
  }
}
