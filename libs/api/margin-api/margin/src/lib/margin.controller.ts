import { Controller } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/margin-api/constants';
import { MarginService } from './margin.service';
import { Subscribe } from '@archie/api/utils/queue';
import { LTV_UPDATED_TOPIC } from '@archie/api/ltv-api/constants';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';

@Controller()
export class MarginQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-margin`;

  constructor(private marginService: MarginService) {}

  @Subscribe(LTV_UPDATED_TOPIC, MarginQueueController.CONTROLLER_QUEUE_NAME)
  async ltvUpdatedHandler(message: LtvUpdatedPayload): Promise<void> {
    await this.marginService.handleLtvUpdatedEvent(message);
  }
}
