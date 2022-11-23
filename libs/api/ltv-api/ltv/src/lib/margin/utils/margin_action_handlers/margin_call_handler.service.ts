import { Injectable } from '@nestjs/common';
import { MarginCall } from '../../entities/margin_calls.entity';
import {
  LIQUIDATION_TARGET_LTV,
  MARGIN_CALL_COMPLETED_TOPIC,
} from '@archie/api/ltv-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { MARGIN_CALL_STARTED_TOPIC } from '@archie/api/ltv-api/constants';
import { MarginCallPriceFactory } from './margin_call_price.factory';
import { MarginActionHandlerPayload } from '../utils.interfaces';
import { INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND } from '@archie/api/ledger-api/constants';
import { Liquidation } from '../../../liquidation/liquidation.entity';
import { MarginEntitiesService } from '../../entities/margin_entities.service';
import { LiquidationService } from '../../../liquidation/liquidation.service';

@Injectable()
export class MarginCallHandlerService {
  constructor(
    private queueService: QueueService,
    private marginCallPriceFactory: MarginCallPriceFactory,
    private marginEntitiesService: MarginEntitiesService,
    private liquidationsService: LiquidationService,
  ) {}

  public async activate(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<MarginActionHandlerPayload> {
    const marginCall: MarginCall =
      await this.marginEntitiesService.createMarginCall(actionPayload.userId);

    this.queueService.publishEvent(MARGIN_CALL_STARTED_TOPIC, {
      userId: actionPayload.userId,
      startedAt: marginCall.createdAt.toISOString(),
      ltv: actionPayload.ltv,
      ...this.marginCallPriceFactory.getMarginCallPrices(actionPayload.ltvMeta),
    });

    return {
      ...actionPayload,
      marginCall: marginCall,
    };
  }

  public async deactivate(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<MarginActionHandlerPayload> {
    const marginCall: MarginCall | null =
      await this.marginEntitiesService.softDeleteMarginCall(
        actionPayload.userId,
      );

    if (marginCall === null) {
      throw new Error('Incorrect margin call deactivate handler usage');
    }

    this.queueService.publishEvent(MARGIN_CALL_COMPLETED_TOPIC, {
      completedAt: marginCall.updatedAt.toISOString(),
      userId: actionPayload.userId,
      liquidationAmount: 0,
      ltv: actionPayload.ltv,
      ...this.marginCallPriceFactory.getMarginCallPrices(actionPayload.ltvMeta),
    });

    return {
      ...actionPayload,
      marginCall: null,
    };
  }

  public async liquidate(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<MarginActionHandlerPayload> {
    if (actionPayload.marginCall === null) {
      throw new Error('Incorrect liquidation handler usage');
    }

    const loanRepaymentAmount: number = this.calculateAmountToReachLtv(
      actionPayload.ltvMeta.creditUtilization,
      actionPayload.ltvMeta.ledgerValue,
      LIQUIDATION_TARGET_LTV,
    );

    const liquidation: Liquidation =
      await this.liquidationsService.createLiquidation(
        actionPayload.marginCall.uuid,
        loanRepaymentAmount,
      );
    await this.queueService.publishEvent(
      INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
      {
        userId: actionPayload.userId,
        amount: loanRepaymentAmount.toString(),
        liquidationId: liquidation.id,
      },
    );

    return {
      ...actionPayload,
      marginCall: {
        ...actionPayload.marginCall,
        liquidation,
      },
    };
  }

  public async completeMarginCall(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<MarginActionHandlerPayload> {
    const marginCall: MarginCall | null =
      await this.marginEntitiesService.softDeleteMarginCall(
        actionPayload.userId,
      );

    if (
      marginCall === null ||
      actionPayload.marginCall === null ||
      actionPayload.marginCall.liquidation === null
    ) {
      throw new Error('Incorrect complete margin call handler usage');
    }

    this.queueService.publishEvent(MARGIN_CALL_COMPLETED_TOPIC, {
      completedAt: marginCall.updatedAt.toISOString(),
      userId: actionPayload.userId,
      liquidationAmount: actionPayload.marginCall.liquidation.amount,
      ltv: actionPayload.ltv,
      ...this.marginCallPriceFactory.getMarginCallPrices(actionPayload.ltvMeta),
    });

    return {
      ...actionPayload,
      marginCall: null,
    };
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
