import { Injectable, Logger } from '@nestjs/common';
import { MarginCall } from '../../margin_calls.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {
  MarginCallCompletedPayload,
  MarginCallStartedPayload,
} from '@archie/api/margin-api/data-transfer-objects';
import { MARGIN_CALL_COMPLETED_TOPIC } from '@archie/api/margin-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { LiquidationUtilService } from './liquidation.service';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { MARGIN_CALL_STARTED_TOPIC } from '@archie/api/margin-api/constants';
import { MarginCallPriceFactory } from './margin_call_price.factory';
import { LiquidationAssets } from './margin_action_handlers.interfaces';

@Injectable()
export class MarginCallHandlerService {
  LIQUIDATION_TARGET_LTV = 60;

  constructor(
    @InjectRepository(MarginCall)
    private marginCallRepository: Repository<MarginCall>,
    private queueService: QueueService,
    private liquidationUtilService: LiquidationUtilService,
    private marginCallPriceFactory: MarginCallPriceFactory,
  ) {}

  public async activate(ltv: LtvUpdatedPayload): Promise<void> {
    await this.marginCallRepository.insert({
      userId: ltv.userId,
    });

    this.queueService.publish<MarginCallStartedPayload>(
      MARGIN_CALL_STARTED_TOPIC,
      {
        userId: ltv.userId,
        ltv: ltv.ltv,
        ...this.marginCallPriceFactory.getMarginCallPrices(ltv.calculatedOn),
      },
    );
  }

  public async deactivate(ltv: LtvUpdatedPayload): Promise<void> {
    const updateResult: UpdateResult =
      await this.marginCallRepository.softDelete({
        userId: ltv.userId,
      });

    if (updateResult.affected === undefined) {
      // TODO: remove after testing
      throw new Error('BUG. FIX!! - deactivation');
    }

    if (updateResult.affected === 0) {
      throw new Error('Already deleted by other process. Retry');
    }

    this.queueService.publish<MarginCallCompletedPayload>(
      MARGIN_CALL_COMPLETED_TOPIC,
      {
        userId: ltv.userId,
        liquidation: [],
        liquidationAmount: 0,
        ltv: ltv.ltv,
        ...this.marginCallPriceFactory.getMarginCallPrices(ltv.calculatedOn),
      },
    );
  }

  public async liquidate(ltv: LtvUpdatedPayload): Promise<void> {
    const loanRepaymentAmount: number = this.calculateAmountToReachLtv(
      ltv.calculatedOn.utilizedCreditAmount,
      ltv.calculatedOn.collateralBalance,
      this.LIQUIDATION_TARGET_LTV,
    );

    const assetsToLiquidate: LiquidationAssets[] =
      this.liquidationUtilService.getAssetsToLiquidate(
        loanRepaymentAmount,
        ltv.calculatedOn.collateral,
      );

    const updateResult: UpdateResult =
      await this.marginCallRepository.softDelete({
        userId: ltv.userId,
      });

    if (updateResult.affected === undefined) {
      // TODO: remove after testing
      throw new Error('BUG. FIX!!');
    }

    if (updateResult.affected === 0) {
      Logger.log('Collateral was already liquidated by other process.', ltv);
      return;
    }

    this.queueService.publish<MarginCallCompletedPayload>(
      MARGIN_CALL_COMPLETED_TOPIC,
      {
        userId: ltv.userId,
        liquidation: assetsToLiquidate,
        liquidationAmount: loanRepaymentAmount,
        ltv: this.LIQUIDATION_TARGET_LTV,
        ...this.marginCallPriceFactory.getMarginCallPrices({
          collateralBalance:
            ltv.calculatedOn.collateralBalance - loanRepaymentAmount,
          utilizedCreditAmount:
            ltv.calculatedOn.utilizedCreditAmount - loanRepaymentAmount,
        }),
      },
    );
  }

  private calculateAmountToReachLtv(
    loanedBalance: number,
    collateralBalance: number,
    targetLtv: number,
  ): number {
    const ltv: number = targetLtv / 100;

    return (loanedBalance - ltv * collateralBalance) / (1 - ltv);
  }
}
