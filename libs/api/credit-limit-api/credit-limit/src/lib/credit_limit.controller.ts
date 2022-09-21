import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/ltv-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import {
  COLLATERAL_DEPOSIT_COMPLETED_TOPIC,
  COLLATERAL_WITHDRAW_COMPLETED_TOPIC,
  COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
} from '@archie/api/credit-api/constants';
import { CollateralDepositCompletedPayload } from '@archie/api/credit-api/data-transfer-objects';
import {
  INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC,
  INTERNAL_COLLATERAL_TRANSACTION_CREATED_TOPIC,
} from '@archie/api/collateral-api/constants';
import { CreditLimitService } from './credit_limit.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  CreateCreditMinimumCollateralError,
  CreditAlreadyExistsError,
} from './credit_limit.errors';
import {
  CollateralWithdrawCompletedPayload,
  CollateralWithdrawInitializedPayload,
  InternalCollateralTransactionCompletedPayload,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';

@Controller('v1/credit_limits')
export class CreditLimitController {
  constructor(private creditLimitService: CreditLimitService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([
    CreateCreditMinimumCollateralError,
    CreditAlreadyExistsError,
  ])
  async createCreditLine(@Req() req): Promise<void> {
    return this.creditLimitService.createCredit(req.user.sub);
  }
}

@Controller()
export class CreditLimitQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-credit-limit`;

  constructor(private creditLimitService: CreditLimitService) {}

  @Subscribe(
    COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
    CreditLimitQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralWithdrawInitializedHandler(
    payload: CollateralWithdrawInitializedPayload,
  ): Promise<void> {
    return this.creditLimitService.handleCollateralWithdrawInitializedEvent(
      payload,
    );
  }

  @Subscribe(
    COLLATERAL_DEPOSIT_COMPLETED_TOPIC,
    CreditLimitQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralDepositCompletedHandler(
    payload: CollateralDepositCompletedPayload,
  ): Promise<void> {
    return this.creditLimitService.handleCollateralDepositCompletedEvent(
      payload,
    );
  }

  @Subscribe(
    INTERNAL_COLLATERAL_TRANSACTION_CREATED_TOPIC,
    CreditLimitQueueController.CONTROLLER_QUEUE_NAME,
  )
  async internalTransactionCreatedHandler(
    payload: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    return this.creditLimitService.handleInternalTransactionCreatedEvent(
      payload,
    );
  }

  @Subscribe(
    INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC,
    CreditLimitQueueController.CONTROLLER_QUEUE_NAME,
  )
  async internalCollateralTransactionCompletedTopic(
    payload: InternalCollateralTransactionCompletedPayload,
  ): Promise<void> {
    await this.creditLimitService.handleTransactionCompletedEvent(payload);
  }

  @Subscribe(
    COLLATERAL_WITHDRAW_COMPLETED_TOPIC,
    CreditLimitQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralWithdrawCompleteHandler(
    payload: CollateralWithdrawCompletedPayload,
  ): Promise<void> {
    await this.creditLimitService.handleTransactionCompletedEvent(payload);
  }
}
