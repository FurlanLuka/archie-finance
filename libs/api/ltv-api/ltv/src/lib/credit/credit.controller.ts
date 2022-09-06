import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import { SERVICE_QUEUE_NAME } from '@archie/api/ltv-api/constants';
import { CreditService } from './credit.service';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects';
import { CreditLineCreatedPayload } from '@archie/api/credit-limit-api/data-transfer-objects';
import { CREDIT_LINE_CREATED_TOPIC } from '@archie/api/credit-limit-api/constants';

@Controller()
export class CreditQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-credit`;

  constructor(private creditService: CreditService) {}

  @Subscribe(
    CREDIT_BALANCE_UPDATED_TOPIC,
    CreditQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditBalanceUpdatedHandler(
    payload: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    await this.creditService.handleCreditBalanceUpdatedEvent(payload);
  }

  @Subscribe(
    CREDIT_LINE_CREATED_TOPIC,
    CreditQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLineCreatedHandler(
    payload: CreditLineCreatedPayload,
  ): Promise<void> {
    await this.creditService.handleCreditLineCreatedEvent(payload);
  }
  // TODO: Add failed events
  // TODO: Migrate existing credit balances
}
