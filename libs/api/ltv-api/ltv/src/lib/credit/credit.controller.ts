import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import { SERVICE_QUEUE_NAME } from '@archie/api/ltv-api/constants';
import { CreditService } from './credit.service';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects';
import { CARD_ACTIVATED_TOPIC } from '@archie/api/credit-api/constants';
import { CardActivatedPayload } from '@archie/api/credit-api/data-transfer-objects';

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

  // TODO migrate to CREDIT_LINE_CREATED_TOPIC?
  @Subscribe(CARD_ACTIVATED_TOPIC, CreditQueueController.CONTROLLER_QUEUE_NAME)
  async cardActivatedHandler(payload: CardActivatedPayload): Promise<void> {
    await this.creditService.handleCardActivatedEvent(payload);
  }

  // TODO: Add failed events
  // TODO: Migrate existing credit balances
}
