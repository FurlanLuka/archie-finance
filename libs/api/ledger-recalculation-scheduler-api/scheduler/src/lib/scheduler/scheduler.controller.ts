import { Controller } from '@nestjs/common';
import {
  BATCH_RECALCULATION_COMPLETED,
  INITIATE_BATCH_RECALCULATION,
  SERVICE_QUEUE_NAME,
} from '@archie/api/ledger-recalculation-scheduler-api/constants';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import {
  CREDIT_LINE_BATCH_RECALCULATION_COMPLETED_TOPIC,
  CREDIT_LINE_CREATED_TOPIC,
} from '@archie/api/credit-line-api/constants';
import { SchedulerService } from './scheduler.service';
import { CollateralReceivedPayload } from '@archie/api/credit-api/data-transfer-objects/types';
import { BatchRecalculationCompletedPayload } from '@archie/api/ledger-recalculation-scheduler-api/data-transfer-objects/types';
import {
  LTV_BATCH_RECALCULATION_COMPLETED_TOPIC,
  LTV_UPDATED_TOPIC,
} from '@archie/api/ltv-api/constants';
import {
  LtvBatchRecalculationCompleted,
  LtvUpdatedPayload,
} from '@archie/api/ltv-api/data-transfer-objects/types';
import { CreditLineBatchRecalculationCompleted } from '@archie/api/credit-line-api/data-transfer-objects/types';

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

  @Subscribe(LTV_UPDATED_TOPIC, SchedulerQueueController.CONTROLLER_QUEUE_NAME)
  async ltvUpdatedHandler({ userId, ltv }: LtvUpdatedPayload): Promise<void> {
    await this.schedulerService.handleLtvUpdatedEvent(userId, ltv);
  }

  @Subscribe(
    CREDIT_LINE_BATCH_RECALCULATION_COMPLETED_TOPIC,
    SchedulerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLineRecalculationCompletedHandler(
    payload: CreditLineBatchRecalculationCompleted,
  ): Promise<void> {
    await this.schedulerService.handleCreditLineRecalculatedEvent(
      payload.batchId,
    );
  }

  @Subscribe(
    LTV_BATCH_RECALCULATION_COMPLETED_TOPIC,
    SchedulerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async ltvRecalculationCompletedHandler(
    payload: LtvBatchRecalculationCompleted,
  ): Promise<void> {
    await this.schedulerService.handleLtvRecalculatedEvent(payload.batchId);
  }

  @Subscribe(
    INITIATE_BATCH_RECALCULATION,
    SchedulerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async initiateBatchRecalculationHandler(): Promise<void> {
    await this.schedulerService.initiateBatchRecalculation();
  }
}
