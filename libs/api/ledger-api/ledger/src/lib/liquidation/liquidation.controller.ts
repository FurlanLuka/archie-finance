import { Controller } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/ledger-api/constants';
import { LiquidationService } from './liquidation.service';
import { Subscribe } from '@archie/api/utils/queue';
import {
  COLLATERAL_LIQUIDATION_TRANSACTION_ERROR_TOPIC,
  COLLATERAL_LIQUIDATION_TRANSACTION_SUBMITTED_TOPIC,
  COLLATERAL_LIQUIDATION_TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/fireblocks-api/constants';
import {
  CollateralLiquidationTransactionErrorPayload,
  CollateralLiquidationTransactionSubmittedPayload,
  CollateralLiquidationTransactionUpdatedPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects';

@Controller()
export class LiquidationQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-liquidation`;

  constructor(private liquidationService: LiquidationService) {}

  @Subscribe(
    COLLATERAL_LIQUIDATION_TRANSACTION_SUBMITTED_TOPIC,
    LiquidationQueueController.CONTROLLER_QUEUE_NAME,
  )
  async liquidationTransactionSubmitted(
    payload: CollateralLiquidationTransactionSubmittedPayload,
  ): Promise<void> {
    return this.liquidationService.liquidationTransactionSubmittedHandler(
      payload,
    );
  }

  @Subscribe(
    COLLATERAL_LIQUIDATION_TRANSACTION_UPDATED_TOPIC,
    LiquidationQueueController.CONTROLLER_QUEUE_NAME,
  )
  async liquidationTransactionUpdated(
    payload: CollateralLiquidationTransactionUpdatedPayload,
  ): Promise<void> {
    return this.liquidationService.liquidationTransactionUpdatedHandler(
      payload,
    );
  }

  @Subscribe(
    COLLATERAL_LIQUIDATION_TRANSACTION_ERROR_TOPIC,
    LiquidationQueueController.CONTROLLER_QUEUE_NAME,
  )
  async liquidationTransactionError(
    payload: CollateralLiquidationTransactionErrorPayload,
  ): Promise<void> {
    return this.liquidationService.liquidationTransactionErrorHandler(payload);
  }
}
