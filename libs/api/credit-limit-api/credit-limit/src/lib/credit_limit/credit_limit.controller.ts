import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/credit-limit-api/constants';
import { LedgerAccountUpdatedPayload } from '@archie/api/ledger-api/data-transfer-objects';

@Controller()
export class CreditLimitQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-ledger`;

  @Subscribe(
    LEDGER_ACCOUNT_UPDATED_TOPIC,
    CreditLimitQueueController.CONTROLLER_QUEUE_NAME,
  )
  async lederUpdated(payload: LedgerAccountUpdatedPayload): Promise<void> {}
}
