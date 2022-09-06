import { Controller, Post } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/margin-api/constants';
import { PeriodicCheckService } from './periodic_check.service';
import { LTV_PERIODIC_CHECK_REQUESTED_TOPIC } from '@archie/api/ltv-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import { LtvPeriodicCheckRequestedPayload } from '@archie/api/ltv-api/data-transfer-objects';

@Controller()
export class PeriodicCheckQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-ltv-periodic-check`;

  constructor(private periodicCheckService: PeriodicCheckService) {}

  @Subscribe(
    LTV_PERIODIC_CHECK_REQUESTED_TOPIC,
    PeriodicCheckQueueController.CONTROLLER_QUEUE_NAME,
  )
  async ltvPeriodicCheckHandler(
    payload: LtvPeriodicCheckRequestedPayload,
  ): Promise<void> {
    await this.periodicCheckService.handlePeriodicLtvCheck(payload.userIds);
  }
}

@Controller('internal/ltvs/periodic_check')
export class InternalPeriodicCheckController {
  constructor(private periodicCheckService: PeriodicCheckService) {}

  @Post()
  public async startPeriodicCheck(): Promise<void> {
    await this.periodicCheckService.triggerPeriodicCheck();
  }
}
