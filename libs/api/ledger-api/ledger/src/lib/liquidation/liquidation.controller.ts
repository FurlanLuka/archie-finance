import { Controller } from '@nestjs/common';
import {
  INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
  SERVICE_QUEUE_NAME,
} from '@archie/api/ledger-api/constants';
import { InitiateLedgerAssetLiquidationCommandPayload } from '@archie/api/ledger-api/data-transfer-objects';
import { LiquidationService } from './liquidation.service';
import { Subscribe } from '@archie/api/utils/queue';

@Controller()
export class LiquidationQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-liquidation`;

  constructor(private liquidationService: LiquidationService) {}

  @Subscribe(
    INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
    LiquidationQueueController.CONTROLLER_QUEUE_NAME,
  )
  async liquidationCommand({
    userId,
    amount,
  }: InitiateLedgerAssetLiquidationCommandPayload): Promise<void> {
    // await this.ledgerService.incrementLedgerAccount(userId, assetId, amount);
  }
}
