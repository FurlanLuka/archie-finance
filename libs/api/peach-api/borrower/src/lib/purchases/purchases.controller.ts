import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  SERVICE_QUEUE_NAME,
  TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/credit-api/constants';
import { PurchasesService } from './purchases.service';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { BorrowerNotFoundError } from '../borrower.errors';

@Controller('v1/card_purchases')
export class PurchasesController {
  constructor(private purchasesController: PurchasesService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError])
  async getDepositAddress(@Req() request): Promise<any> {
    return this.purchasesController.getPurchases(request.user.sub);
  }
}

@Controller()
export class PurchasesQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-borrower-purchases`;

  constructor(private purchasesController: PurchasesService) {}

  @Subscribe(
    TRANSACTION_UPDATED_TOPIC,
    PurchasesQueueController.CONTROLLER_QUEUE_NAME,
  )
  async transactionUpdatedHandler(payload): Promise<void> {
    await this.purchasesController.handleTransactionsEvent(payload);
  }
}
