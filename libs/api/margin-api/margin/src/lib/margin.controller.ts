import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/margin-api/constants';
import { MarginService } from './margin.service';
import { Subscribe } from '@archie/api/utils/queue';
import {
  LTV_UPDATED_TOPIC,
  MULTIPLE_LTVS_UPDATED_TOPIC,
} from '@archie/api/ltv-api/constants';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { MarginCallQueryDto, MarginCallsDto } from './margin.dto';

@Controller('v1/margin_calls')
export class MarginController {
  constructor(private marginService: MarginService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([])
  async getMarginCalls(
    @Request() req,
    @Query() query: MarginCallQueryDto,
  ): Promise<MarginCallsDto[]> {
    return this.marginService.getMarginCalls(req.user.sub, query);
  }
}

@Controller()
export class MarginQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-margin`;

  constructor(private marginService: MarginService) {}

  @Subscribe(LTV_UPDATED_TOPIC, MarginQueueController.CONTROLLER_QUEUE_NAME)
  async ltvUpdatedHandler(message: LtvUpdatedPayload): Promise<void> {
    await this.marginService.handleLtvUpdatedEvent(message);
  }

  @Subscribe(
    MULTIPLE_LTVS_UPDATED_TOPIC,
    MarginQueueController.CONTROLLER_QUEUE_NAME,
  )
  async mutlipleltvsUpdatedHandler(
    message: LtvUpdatedPayload[],
  ): Promise<void> {
    await this.marginService.handleMultipleLtvsUpdatedEvent(message);
  }
}
