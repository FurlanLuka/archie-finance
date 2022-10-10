import { Controller } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/fireblocks-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import { WEBHOOK_FIREBLOCKS_DEPOSIT_TRANSACTION_TOPIC } from '@archie/api/webhook-api/constants';
import { FireblocksDepositTransactionPayload } from '@archie/api/webhook-api/data-transfer-objects';
import { DepositService } from './deposit.service';

@Controller()
export class DepositQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-deposit`;

  constructor(private depositService: DepositService) {}

  @Subscribe(
    WEBHOOK_FIREBLOCKS_DEPOSIT_TRANSACTION_TOPIC,
    DepositQueueController.CONTROLLER_QUEUE_NAME,
  )
  async depositTransactionHandler(
    payload: FireblocksDepositTransactionPayload,
  ): Promise<void> {
    return this.depositService.depositTransactionHandler(payload);
  }
}
