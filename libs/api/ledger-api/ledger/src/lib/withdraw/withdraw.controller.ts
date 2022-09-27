import { Controller } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/ledger-api/constants';
import { WithdrawService } from './withdraw.service';
import {
  COLLATERAL_WITHDRAWAL_TRANSACTION_ERROR_TOPIC,
  COLLATERAL_WITHDRAWAL_TRANSACTION_SUBMITTED_TOPIC,
  COLLATERAL_WITHDRAWAL_TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/fireblocks-api/constants';
import {
  CollateralWithdrawalTransactionErrorPayload,
  CollateralWithdrawalTransactionSubmittedPayload,
  CollateralWithdrawalTransactionUpdatedPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects';
import { Subscribe } from '@archie/api/utils/queue';

@Controller('/v1/ledger/withdraw')
export class WithdrawController {}

@Controller()
export class WithdrawQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-withdraw`;

  constructor(private withdrawService: WithdrawService) {}

  @Subscribe(
    COLLATERAL_WITHDRAWAL_TRANSACTION_SUBMITTED_TOPIC,
    WithdrawQueueController.CONTROLLER_QUEUE_NAME,
  )
  async withdrawalTransactionSubmitted(
    payload: CollateralWithdrawalTransactionSubmittedPayload,
  ): Promise<void> {
    return this.withdrawService.withdrawalTransactionSubmittedHandler(payload);
  }

  @Subscribe(
    COLLATERAL_WITHDRAWAL_TRANSACTION_UPDATED_TOPIC,
    WithdrawQueueController.CONTROLLER_QUEUE_NAME,
  )
  async withdrawalTransactionUpdated(
    payload: CollateralWithdrawalTransactionUpdatedPayload,
  ): Promise<void> {
    return this.withdrawService.withdrawalTransactionUpdatedHandler(payload);
  }

  @Subscribe(
    COLLATERAL_WITHDRAWAL_TRANSACTION_ERROR_TOPIC,
    WithdrawQueueController.CONTROLLER_QUEUE_NAME,
  )
  async withdrawalTransactionError(
    payload: CollateralWithdrawalTransactionErrorPayload,
  ): Promise<void> {
    return this.withdrawService.withdrawalTransactionErrorHandler(payload);
  }
}
