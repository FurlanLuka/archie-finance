import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MarginService } from './margin.service';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CREDIT_LIMIT_ADJUST_REQUESTED_TOPIC,
  CREDIT_LINE_UPDATED_TOPIC,
  MARGIN_CHECK_REQUESTED_TOPIC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';
import { CheckMarginMessage } from './margin.interfaces';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LtvResponseDto } from './margin.dto';
import { CreditLineUpdatedDto } from '@archie/api/credit-api/data-transfer-objects';

@Controller()
export class MarginQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-margin`;

  constructor(private marginService: MarginService) {}

  @Subscribe(
    MARGIN_CHECK_REQUESTED_TOPIC,
    MarginQueueController.CONTROLLER_QUEUE_NAME,
  )
  async checkMarginHandler(message: CheckMarginMessage): Promise<void> {
    return this.marginService.checkMargin(message.userIds);
  }

  @Subscribe(
    CREDIT_LIMIT_ADJUST_REQUESTED_TOPIC,
    MarginQueueController.CONTROLLER_QUEUE_NAME,
  )
  async checkCreditLimitHandler(message: CheckMarginMessage): Promise<void> {
    return this.marginService.checkCreditLimit(message.userIds);
  }

  @Subscribe(
    CREDIT_LINE_UPDATED_TOPIC,
    MarginQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLineUpdatedHandler(message: CreditLineUpdatedDto): Promise<void> {
    return this.marginService.handleCreditLineUpdatedEvent(message.userId);
  }
}

@Controller('v1/margins')
export class MarginController {
  constructor(private marginService: MarginService) {}

  @Get('ltv')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getCurrentLtv(@Req() request): Promise<LtvResponseDto> {
    return this.marginService.getCurrentLtv(request.user.sub);
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
