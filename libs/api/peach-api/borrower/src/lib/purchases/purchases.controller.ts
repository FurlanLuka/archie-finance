import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  SERVICE_QUEUE_NAME,
  TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/credit-api/constants';
import { PurchasesService } from './purchases.service';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  BorrowerNotFoundError,
  CreditLineNotFoundError,
  DrawNotFoundError,
} from '../borrower.errors';
import { GetPurchasesQueryDto, PurchasesResponseDto } from './purchases.dto';
import { TransactionUpdatedPayload } from '@archie/api/credit-api/data-transfer-objects';

@Controller('v1/card_purchases')
export class PurchasesController {
  constructor(private purchasesController: PurchasesService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([
    BorrowerNotFoundError,
    CreditLineNotFoundError,
    DrawNotFoundError,
  ])
  async getPurchases(
    @Req() request,
    @Query() query: GetPurchasesQueryDto,
  ): Promise<PurchasesResponseDto> {
    return this.purchasesController.getPurchases(request.user.sub, query);
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
  async transactionUpdatedHandler(
    payload: TransactionUpdatedPayload,
  ): Promise<void> {
    await this.purchasesController.handleTransactionsEvent(payload);
  }
}
