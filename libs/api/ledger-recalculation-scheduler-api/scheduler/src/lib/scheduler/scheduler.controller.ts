import { Controller } from '@nestjs/common';
import {
  BATCH_RECALCULATION_COMPLETED,
  INITIATE_BATCH_RECALCULATION,
  SERVICE_QUEUE_NAME,
} from '@archie/api/ledger-recalculation-scheduler-api/constants';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import { CREDIT_LINE_CREATED_TOPIC } from '@archie/api/credit-line-api/constants';
import { SchedulerService } from './scheduler.service';
import { CollateralReceivedPayload } from '@archie/api/credit-api/data-transfer-objects/types';
import { BatchRecalculationCompletedPayload } from '@archie/api/ledger-recalculation-scheduler-api/data-transfer-objects/types';

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

  @Subscribe(
    INITIATE_BATCH_RECALCULATION,
    SchedulerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async initiateBatchRecalculationHandler(): Promise<void> {
    await this.schedulerService.initiateBatchRecalculation();
  }
  @Subscribe(
    BATCH_RECALCULATION_COMPLETED,
    SchedulerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async batchRecalculationCompletedHandler({
    batchId,
  }: BatchRecalculationCompletedPayload): Promise<void> {
    await this.schedulerService.handleBatchRecalculated(batchId);
  }
}
