import { Controller, Post } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import { CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED } from '@archie/api/credit-limit-api/constants';
import { CreditLimitPeriodicCheckRequestedPayload } from '@archie/api/credit-limit-api/data-transfer-objects';
import { SERVICE_QUEUE_NAME } from '@archie/api/ltv-api/constants';
import { PeriodicCheckService } from './periodic_check.service';

@Controller()
export class PeriodicCheckQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-credit-limit-periodic-check`;

  constructor(private creditLimitService: PeriodicCheckService) {}

  @Subscribe(
    CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED,
    PeriodicCheckQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLimitPeriodicCheckHandler(
    payload: CreditLimitPeriodicCheckRequestedPayload,
  ): Promise<void> {
    return this.creditLimitService.handlePeriodicCreditLimitCheck(
      payload.userIds,
    );
  }
}

@Controller('internal/credit_limits/periodic_check')
export class InternalPeriodicCheckController {
  constructor(private creditLimitService: PeriodicCheckService) {}

  @Post()
  public async paymentConfirmedHandler(): Promise<void> {
    await this.creditLimitService.triggerPeriodicCheck();
  }
}
