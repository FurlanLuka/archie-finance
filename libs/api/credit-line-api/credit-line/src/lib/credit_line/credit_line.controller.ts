import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import {
  LEDGER_ACCOUNT_UPDATED_TOPIC,
  LEDGER_ACCOUNTS_UPDATED_TOPIC,
} from '@archie/api/ledger-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/credit-line-api/constants';
import { LedgerAccountUpdatedPayload } from '@archie/api/ledger-api/data-transfer-objects/types';
import { CreditLineService } from './credit_line.service';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  CreditLineAlreadyExistsError,
  CreditLineNotFoundError,
  NotEnoughCollateralError,
} from './credit_line.errors';
import { CreditLineDto } from '@archie/api/credit-line-api/data-transfer-objects';

@Controller('/v2/credit_lines')
export class CreditLineController {
  constructor(private creditLineService: CreditLineService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([CreditLineAlreadyExistsError, NotEnoughCollateralError])
  async createCreditLine(@Req() req): Promise<CreditLineDto> {
    return this.creditLineService.createCreditLine(req.user.sub);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([CreditLineNotFoundError])
  async getCreditLine(@Req() req): Promise<CreditLineDto> {
    return this.creditLineService.getCreditLine(req.user.sub);
  }
}

@Controller()
export class CreditLineQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-ledger`;

  constructor(private creditLineService: CreditLineService) {}

  @Subscribe(
    LEDGER_ACCOUNT_UPDATED_TOPIC,
    CreditLineQueueController.CONTROLLER_QUEUE_NAME,
  )
  async ledgerUpdated(payload: LedgerAccountUpdatedPayload): Promise<void> {
    return this.creditLineService.ledgerAccountUpdatedHandler(payload);
  }

  @Subscribe(
    LEDGER_ACCOUNTS_UPDATED_TOPIC,
    CreditLineQueueController.CONTROLLER_QUEUE_NAME,
  )
  async ledgersUpdated(payload: LedgerAccountUpdatedPayload[]): Promise<void> {
    return this.creditLineService.ledgerAccountsUpdatedHandler(payload);
  }
}
