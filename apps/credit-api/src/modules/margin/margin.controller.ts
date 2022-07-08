import { Controller, Post } from '@nestjs/common';
import { MarginService } from './margin.service';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CHECK_MARGIN_EXCHANGE,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';
import { CheckMarginMessage } from './margin.interfaces';

@Controller()
export class MarginQueueController {
  constructor(private marginService: MarginService) {}

  @Subscribe(CHECK_MARGIN_EXCHANGE, SERVICE_QUEUE_NAME)
  async checkMargin(message: CheckMarginMessage): Promise<void> {
    return this.marginService.checkMargin(message.userIds);
  }
}
