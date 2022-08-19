import {
  Body,
  Controller,
  Delete,
  Param,
  Request,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CARD_ACTIVATED_TOPIC,
  CREDIT_FUNDS_LOADED_TOPIC,
  CREDIT_LIMIT_DECREASED_TOPIC,
  CREDIT_LIMIT_INCREASED_TOPIC,
  SERVICE_QUEUE_NAME,
  TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/credit-api/constants';
import { PeachBorrowerService } from './borrower.service';
import {
  EMAIL_VERIFIED_TOPIC,
  KYC_SUBMITTED_TOPIC,
} from '@archie/api/user-api/constants';
import { KycSubmittedPayload } from '@archie/api/user-api/kyc';
import { EmailVerifiedPayload } from '@archie/api/user-api/user';
import {
  INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC,
  INTERNAL_COLLATERAL_TRANSACTION_CREATED_TOPIC,
} from '@archie/api/collateral-api/constants';
import { InternalCollateralTransactionCreatedPayload } from '@archie/api/collateral-api/fireblocks';
import { InternalCollateralTransactionCompletedPayload } from '@archie/api/collateral-api/fireblocks-webhook';
import { WEBHOOK_PEACH_PAYMENT_CONFIRMED_TOPIC } from '@archie/api/webhook-api/constants';
import {
  CreditLimitDecreasedPayload,
  CreditLimitIncreasedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { WebhookPaymentPayload } from '@archie/api/webhook-api/data-transfer-objects';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConnectAccountDto, ObligationsResponseDto, ScheduleTransactionDto } from './borrower.dto';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  AmountExceedsOutstandingBalanceError,
  BorrowerNotFoundError,
  PaymentInstrumentNotFoundError,
} from './borrower.errors';

@Controller()
export class PeachBorrowerQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-borrower`;

  constructor(private peachService: PeachBorrowerService) {}

  @Subscribe(
    KYC_SUBMITTED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async kycSubmittedHandler(payload: KycSubmittedPayload): Promise<void> {
    await this.peachService.handleKycSubmittedEvent(payload);
  }

  @Subscribe(
    EMAIL_VERIFIED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async emailVerifiedHandler(payload: EmailVerifiedPayload): Promise<void> {
    await this.peachService.handleEmailVerifiedEvent(payload);
  }

  @Subscribe(
    CARD_ACTIVATED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async cardActivatedHandler(payload): Promise<void> {
    await this.peachService.handleCardActivatedEvent(payload);
  }

  @Subscribe(
    CREDIT_FUNDS_LOADED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditFundsLoadedHandler(payload): Promise<void> {
    await this.peachService.handleFundsLoadedEvent(payload);
  }

  @Subscribe(
    CREDIT_LIMIT_INCREASED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLimitIncreasedHandler(
    payload: CreditLimitIncreasedPayload,
  ): Promise<void> {
    await this.peachService.handleCreditLimitIncreased(payload);
  }

  @Subscribe(
    CREDIT_LIMIT_DECREASED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLimitDecreasedHandler(
    payload: CreditLimitDecreasedPayload,
  ): Promise<void> {
    await this.peachService.handleCreditLimitDecreased(payload);
  }

  @Subscribe(
    TRANSACTION_UPDATED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async transactionUpdatedHandler(payload): Promise<void> {
    await this.peachService.handleTransactionsEvent(payload);
  }

  @Subscribe(
    INTERNAL_COLLATERAL_TRANSACTION_CREATED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async internalTransactionCreatedHandler(
    payload: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    await this.peachService.handleInternalTransactionCreatedEvent(payload);
  }

  @Subscribe(
    INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async internalTransactionCompletedHandler(
    payload: InternalCollateralTransactionCompletedPayload,
  ): Promise<void> {
    await this.peachService.handleInternalTransactionCompletedEvent(payload);
  }

  @Subscribe(
    WEBHOOK_PEACH_PAYMENT_CONFIRMED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async peachWebhookPaymentConfirmedHandler(
    payload: WebhookPaymentPayload,
  ): Promise<void> {
    await this.peachService.handlePaymentConfirmedEvent(payload);
  }
}

@Controller('v1/loans')
export class PeachBorrowerController {
  constructor(private peachService: PeachBorrowerService) {}

  @Get('obligations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError])
  async getCreditObligations(@Req() request): Promise<ObligationsResponseDto> {
    return this.peachService.getObligations(request.user.sub);
  }

  @Post('scheduled_transactions')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(202)
  @ApiErrorResponse([
    BorrowerNotFoundError,
    PaymentInstrumentNotFoundError,
    AmountExceedsOutstandingBalanceError,
  ])
  async scheduleTransaction(
    @Req() request,
    @Body() body: ScheduleTransactionDto,
  ): Promise<void> {
    return this.peachService.scheduleTransaction(request.user.sub, body);
  }

  @Post('connected_accounts')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async connectAccount(
    @Request() req,
    @Body() body: ConnectAccountDto,
  ): Promise<void> {
    return this.peachService.connectAccount(req.user.sub, body);
  }

  /*
  @Delete('connected_accounts/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async removeAccount(
    @Request() req,
    @Param('id') id: string,
  ): Promise<void> {
    return this.plaidService.removeAccount(req.user.sub, id);
  }
  */
}
