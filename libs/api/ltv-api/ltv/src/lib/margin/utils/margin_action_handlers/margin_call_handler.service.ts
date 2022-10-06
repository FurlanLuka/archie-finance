import { Injectable, Logger } from '@nestjs/common';
import { MarginCall } from '../../margin_calls.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MarginCallCompletedPayload,
  MarginCallStartedPayload,
} from '@archie/api/ltv-api/data-transfer-objects';
import {
  LIQUIDATION_TARGET_LTV,
  MARGIN_CALL_COMPLETED_TOPIC,
} from '@archie/api/ltv-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { MARGIN_CALL_STARTED_TOPIC } from '@archie/api/ltv-api/constants';
import { MarginCallPriceFactory } from './margin_call_price.factory';
import { MarginActionHandlerPayload } from '../utils.interfaces';
import { INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND } from '@archie/api/ledger-api/constants';
import { InitiateLedgerAssetLiquidationCommandPayload } from '@archie/api/ledger-api/data-transfer-objects';
import { Liquidation } from '../../liquidation.entity';

@Injectable()
export class MarginCallHandlerService {
  constructor(
    @InjectRepository(MarginCall)
    private marginCallRepository: Repository<MarginCall>,
    @InjectRepository(Liquidation)
    private liquidationRepository: Repository<Liquidation>,
    private queueService: QueueService,
    private marginCallPriceFactory: MarginCallPriceFactory,
  ) {}

  public async activate(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<void> {
    const marginCall: MarginCall = await this.marginCallRepository.save({
      userId: actionPayload.userId,
    });

    this.queueService.publish<MarginCallStartedPayload>(
      MARGIN_CALL_STARTED_TOPIC,
      {
        userId: actionPayload.userId,
        startedAt: marginCall.createdAt.toISOString(),
        ltv: actionPayload.ltv,
        ...this.marginCallPriceFactory.getMarginCallPrices(
          actionPayload.ltvMeta,
        ),
      },
    );
  }

  public async deactivate(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<void> {
    const marginCall: MarginCall | null = await this.softDeleteMarginCall(
      actionPayload.userId,
    );

    if (marginCall === null) {
      Logger.warn('UNEXPECTED: Margin call is not defined.', {
        userId: actionPayload.userId,
      });

      return;
    }

    this.queueService.publish<MarginCallCompletedPayload>(
      MARGIN_CALL_COMPLETED_TOPIC,
      {
        completedAt: marginCall.updatedAt.toISOString(),
        userId: actionPayload.userId,
        liquidationAmount: 0,
        ltv: actionPayload.ltv,
        ...this.marginCallPriceFactory.getMarginCallPrices(
          actionPayload.ltvMeta,
        ),
      },
    );
  }

  public async liquidate(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<void> {
    const loanRepaymentAmount: number = this.calculateAmountToReachLtv(
      actionPayload.ltvMeta.creditUtilization,
      actionPayload.ltvMeta.ledgerValue,
      LIQUIDATION_TARGET_LTV,
    );

    const liquidation: Liquidation = await this.liquidationRepository.save({
      marginCall: {
        userId: actionPayload.userId,
      },
      amount: loanRepaymentAmount,
    });

    this.queueService.publish<InitiateLedgerAssetLiquidationCommandPayload>(
      INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
      {
        userId: actionPayload.userId,
        amount: loanRepaymentAmount.toString(),
        liquidationId: liquidation.id,
      },
    );
  }

  public async completeMarginCall(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<void> {
    const marginCall: MarginCall | null = await this.softDeleteMarginCall(
      actionPayload.userId,
    );

    if (marginCall === null) {
      Logger.warn('UNEXPECTED: Margin call is not defined.', {
        userId: actionPayload.userId,
      });

      return;
    }

    const liquidation: Liquidation =
      await this.liquidationRepository.findOneByOrFail({
        marginCall: { uuid: marginCall.uuid },
      });

    this.queueService.publish<MarginCallCompletedPayload>(
      MARGIN_CALL_COMPLETED_TOPIC,
      {
        completedAt: marginCall.updatedAt.toISOString(),
        userId: actionPayload.userId,
        liquidationAmount: liquidation.amount,
        ltv: actionPayload.ltv,
        ...this.marginCallPriceFactory.getMarginCallPrices(
          actionPayload.ltvMeta,
        ),
      },
    );
  }

  private softDeleteMarginCall(userId: string): Promise<MarginCall | null> {
    return this.marginCallRepository
      .createQueryBuilder()
      .softDelete()
      .where({
        userId,
      })
      .returning('*')
      .execute()
      .then((deletedResult): MarginCall | null => deletedResult.raw[0] ?? null);
  }

  private calculateAmountToReachLtv(
    creditUtilization: number,
    ledgerValue: number,
    targetLtv: number,
  ): number {
    const ltv: number = targetLtv / 100;

    const amount = (creditUtilization - ltv * ledgerValue) / (1 - ltv);

    return Math.min(amount, ledgerValue);
  }
}
