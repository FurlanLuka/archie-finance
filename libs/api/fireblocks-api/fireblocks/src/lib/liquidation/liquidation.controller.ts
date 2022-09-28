import { Controller } from '@nestjs/common';
import {
  INITIATE_COLLATERAL_LIQUIDATION_COMMAND,
  SERVICE_QUEUE_NAME,
} from '@archie/api/fireblocks-api/constants';
import { InitiateCollateralLiquidationCommandPayload } from '@archie/api/fireblocks-api/data-transfer-objects';
import { WEBHOOK_FIREBLOCKS_INTERNAL_TRANSACTION_TOPIC } from '@archie/api/webhook-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import { FireblocksInternalTransactionPayload } from '@archie/api/webhook-api/data-transfer-objects';
import { LiquidationService } from './liquidation.service';

@Controller()
export class LiquidationQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-liquidation`;

  constructor(private liquidationService: LiquidationService) {}

  @Subscribe(
    WEBHOOK_FIREBLOCKS_INTERNAL_TRANSACTION_TOPIC,
    LiquidationQueueController.CONTROLLER_QUEUE_NAME,
  )
  async liquidationTransaction(
    payload: FireblocksInternalTransactionPayload,
  ): Promise<void> {
    return this.liquidationService.liquidationTransactionHandler(payload);
  }

  @Subscribe(
    INITIATE_COLLATERAL_LIQUIDATION_COMMAND,
    LiquidationQueueController.CONTROLLER_QUEUE_NAME,
  )
  async initiateLiquidationCommand(
    payload: InitiateCollateralLiquidationCommandPayload,
  ): Promise<void> {
    return this.liquidationService.initiateCollateralLiquidationCommandHandler(
      payload,
    );
  }
}
