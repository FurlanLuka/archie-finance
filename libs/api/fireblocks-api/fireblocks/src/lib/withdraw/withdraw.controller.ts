import { Controller } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/fireblocks-api/constants';
import { WithdrawService } from './withdraw.service';
import { WEBHOOK_FIREBLOCKS_WITHDRAWAL_TRANSACTION_TOPIC } from '@archie/api/webhook-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import { FireblocksWithdrawTransactionPayload } from '@archie/api/webhook-api/data-transfer-objects';

@Controller()
export class WithdrawQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-withdraw`;

  constructor(private withdrawService: WithdrawService) {}

  @Subscribe(
    WEBHOOK_FIREBLOCKS_WITHDRAWAL_TRANSACTION_TOPIC,
    WithdrawQueueController.CONTROLLER_QUEUE_NAME,
  )
  async depositTransactionHandler(
    payload: FireblocksWithdrawTransactionPayload,
  ): Promise<void> {
    return this.withdrawService.withdrawalTransactionHandler(payload);
  }
}
