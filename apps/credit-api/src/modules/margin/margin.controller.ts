import { Controller, Post } from '@nestjs/common';
import { MarginService } from './margin.service';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CREDIT_LIMIT_ADJUST_REQUESTED_EXCHANGE,
  MARGIN_CHECK_REQUESTED_EXCHANGE,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';
import { CheckMarginMessage } from './margin.interfaces';

@Controller()
export class MarginQueueController {
  constructor(private marginService: MarginService) {}

  @Subscribe(MARGIN_CHECK_REQUESTED_EXCHANGE, SERVICE_QUEUE_NAME)
  async checkMarginHandler(message: CheckMarginMessage): Promise<void> {
    return this.marginService.checkMargin(message.userIds);
  }

  @Subscribe(CREDIT_LIMIT_ADJUST_REQUESTED_EXCHANGE, SERVICE_QUEUE_NAME)
  async checkCreditLimitHandler(message: CheckMarginMessage): Promise<void> {
    return this.marginService.checkCreditLimit(message.userIds);
  }
}

@Controller('internal/margins')
export class MarginInternalController {
  constructor(private marginService: MarginService) {}

  @Post('check')
  async checkMargin(): Promise<void> {
    return this.marginService.triggerMarginCheck();
  }
}