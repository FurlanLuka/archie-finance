import { Controller } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/ledger-recalculation-scheduler-api/constants';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import { CREDIT_LINE_CREATED_TOPIC } from '@archie/api/credit-line-api/constants';
import { SchedulerService } from './scheduler.service';
import { CollateralReceivedPayload } from '@archie/api/credit-api/data-transfer-objects/types';

@Controller()
export class SchedulerQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-scheduler`;

  constructor(private schedulerService: SchedulerService) {}

  @Subscribe(
    CREDIT_LINE_CREATED_TOPIC,
    SchedulerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralReceivedEventHandler(
    payload: CollateralReceivedPayload,
  ): Promise<void> {
    await this.schedulerService.createInitialUserRecalculation(payload.userId);
  }
}
