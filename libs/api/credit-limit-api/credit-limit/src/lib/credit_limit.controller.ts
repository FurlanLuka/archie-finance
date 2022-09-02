import { Controller, Post } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/ltv-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import {
  COLLATERAL_DEPOSIT_COMPLETED_TOPIC,
  COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
} from '@archie/api/credit-api/constants';
import {
  CollateralWithdrawInitializedDto,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/fireblocks';
import { CollateralDepositCompletedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { INTERNAL_COLLATERAL_TRANSACTION_CREATED_TOPIC } from '@archie/api/collateral-api/constants';
import { CreditLimitService } from './credit_limit.service';
import { PeachWebhookService } from '@archie/api/webhook-api/peach';
import { CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED } from '@archie/api/credit-limit-api/constants';
import { CreditLimitPeriodicCheckRequestedPayload } from '@archie/api/credit-limit-api/data-transfer-objects';

@Controller()
export class CreditLimitQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-credit-limit`;

  constructor(private creditLimitService: CreditLimitService) {}

  @Subscribe(
    COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
    CreditLimitQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralWithdrawInitializedHandler(
    payload: CollateralWithdrawInitializedDto,
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
    CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED,
    CreditLimitQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLimitPeriodicCheckHandler(
    payload: CreditLimitPeriodicCheckRequestedPayload,
  ): Promise<void> {
    return this.creditLimitService.handlePeriodicCreditLimitCheck(
      payload.userIds,
    );
  }
}

@Controller('internal/credit_limits/periodic_check')
export class InternalCreditLimitController {
  constructor(private creditLimitService: CreditLimitService) {}

  @Post()
  public async paymentConfirmedHandler(): Promise<void> {
    await this.creditLimitService.triggerPeriodicCheck();
  }
}
