import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LtvDto } from '@archie/api/ltv-api/data-transfer-objects';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LtvService } from './ltv.service';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { CreditNotSetUpError } from './ltv.errors';
import { CREDIT_LINE_CREATED_TOPIC } from '@archie/api/credit-line-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/ltv-api/constants';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';
import { LedgerAccountUpdatedPayload } from '@archie/api/ledger-api/data-transfer-objects/types';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects';
import { CreditLineCreatedPayload } from '@archie/api/credit-line-api/data-transfer-objects';

@Controller('v1/ltv')
export class LtvController {
  constructor(private ltvService: LtvService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([CreditNotSetUpError])
  async getCurrentLtv(@Req() request): Promise<LtvDto> {
    return this.ltvService.getCurrentLtv(request.user.sub);
  }
}

@Controller()
export class LtvQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-ledger`;

  constructor(private ltvService: LtvService) {}

  @Subscribe(
    LEDGER_ACCOUNT_UPDATED_TOPIC,
    LtvQueueController.CONTROLLER_QUEUE_NAME,
  )
  async ledgerUpdated(payload: LedgerAccountUpdatedPayload): Promise<void> {
    return this.ltvService.handleLedgerAccountUpdatedEvent(payload);
  }

  @Subscribe(
    CREDIT_BALANCE_UPDATED_TOPIC,
    LtvQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditBalanceUpdatedHandler(
    payload: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    await this.ltvService.handleCreditBalanceUpdatedEvent(payload);
  }

  @Subscribe(
    CREDIT_LINE_CREATED_TOPIC,
    LtvQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLineCreatedHandler(
    payload: CreditLineCreatedPayload,
  ): Promise<void> {
    await this.ltvService.handleCreditLineCreatedEvent(payload);
  }
}
