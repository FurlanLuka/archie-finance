import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@archie/api/utils/auth0';
import { PaymentsService } from './payments.service';
import {
  AmountExceedsAvailableBalanceError,
  AmountExceedsOutstandingBalanceError,
  BorrowerNotFoundError,
  CreditLineNotFoundError,
  DrawNotFoundError,
  PaymentInstrumentNotFoundError,
} from '../borrower.errors';
import {
  GetPaymentsQueryDto,
  PaymentsResponseDto,
  ScheduleTransactionDto,
} from './payments.dto';
import { Subscribe } from '@archie/api/utils/queue';
import { WEBHOOK_PEACH_PAYMENT_CONFIRMED_TOPIC } from '@archie/api/webhook-api/constants';
import { PeachWebhookPaymentPayload } from '@archie/api/webhook-api/data-transfer-objects';
import { SERVICE_QUEUE_NAME } from '@archie/api/credit-api/constants';
import {
  INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC,
  INTERNAL_COLLATERAL_TRANSACTION_CREATED_TOPIC,
} from '@archie/api/collateral-api/constants';
import { PAYPAL_PAYMENT_RECEIVED_TOPIC } from '@archie/api/paypal-api/constants';
import { PaypalPaymentReceivedPayload } from '@archie/api/paypal-api/paypal';
import {
  InternalCollateralTransactionCompletedPayload,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';

@Controller('v1/loan_payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, CreditLineNotFoundError])
  async getPayments(
    @Req() request,
    @Query() query: GetPaymentsQueryDto,
  ): Promise<PaymentsResponseDto> {
    return this.paymentsService.getPayments(request.user.sub, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(202)
  @ApiErrorResponse([
    BorrowerNotFoundError,
    CreditLineNotFoundError,
    DrawNotFoundError,
    PaymentInstrumentNotFoundError,
    AmountExceedsOutstandingBalanceError,
    AmountExceedsAvailableBalanceError,
  ])
  async scheduleTransaction(
    @Req() request,
    @Body() body: ScheduleTransactionDto,
  ): Promise<void> {
    return this.paymentsService.scheduleTransaction(request.user.sub, body);
  }
}

@Controller()
export class PaymentsQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-borrower-payments`;

  constructor(private paymentsService: PaymentsService) {}

  @Subscribe(
    WEBHOOK_PEACH_PAYMENT_CONFIRMED_TOPIC,
    PaymentsQueueController.CONTROLLER_QUEUE_NAME,
  )
  async peachWebhookPaymentConfirmedHandler(
    payload: PeachWebhookPaymentPayload,
  ): Promise<void> {
    await this.paymentsService.handlePaymentConfirmedEvent(payload);
  }

  @Subscribe(
    INTERNAL_COLLATERAL_TRANSACTION_CREATED_TOPIC,
    PaymentsQueueController.CONTROLLER_QUEUE_NAME,
  )
  async internalTransactionCreatedHandler(
    payload: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    await this.paymentsService.handleInternalTransactionCreatedEvent(payload);
  }

  @Subscribe(
    INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC,
    PaymentsQueueController.CONTROLLER_QUEUE_NAME,
  )
  async internalTransactionCompletedHandler(
    payload: InternalCollateralTransactionCompletedPayload,
  ): Promise<void> {
    await this.paymentsService.handleInternalTransactionCompletedEvent(payload);
  }

  @Subscribe(
    PAYPAL_PAYMENT_RECEIVED_TOPIC,
    PaymentsQueueController.CONTROLLER_QUEUE_NAME,
  )
  async paypalPaymentHandler(
    payload: PaypalPaymentReceivedPayload,
  ): Promise<void> {
    await this.paymentsService.handlePaypalPaymentReceivedEvent(payload);
  }
}
