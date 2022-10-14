import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
  SERVICE_QUEUE_NAME,
} from '@archie/api/ledger-api/constants';
import { LiquidationService } from './liquidation.service';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
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
import {
  InitiateLedgerAssetLiquidationCommandPayload,
  Liquidation,
} from '@archie/api/ledger-api/data-transfer-objects';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/ledger/liquidation')
export class LiquidationController {
  constructor(private liquidationService: LiquidationService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getLiquidations(@Req() request): Promise<Liquidation[]> {
    return this.liquidationService.getliquidations(request.user.sub);
  }
}

@Controller()
export class LiquidationQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-liquidation`;

  constructor(private liquidationService: LiquidationService) {}

  @Subscribe(
    INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
    LiquidationQueueController.CONTROLLER_QUEUE_NAME,
  )
  async initiateLiquidationCommand(
    payload: InitiateLedgerAssetLiquidationCommandPayload,
  ): Promise<void> {
    return this.liquidationService.initiateLedgerAssetLiquidation(payload);
  }

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
