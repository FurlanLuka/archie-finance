import { Controller, Get, UseGuards } from '@nestjs/common';
import { SERVICE_QUEUE_NAME } from '@archie/api/ledger-api/constants';
import { WithdrawService } from './withdraw.service';
import {
  COLLATERAL_DEPOSIT_COMPLETED_TOPIC,
  COLLATERAL_WITHDRAWAL_TRANSACTION_ERROR_TOPIC,
  COLLATERAL_WITHDRAWAL_TRANSACTION_SUBMITTED_TOPIC,
  COLLATERAL_WITHDRAWAL_TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/fireblocks-api/constants';
import {
  CollateralDepositCompletedPayload,
  CollateralWithdrawalTransactionErrorPayload,
  CollateralWithdrawalTransactionUpdatedPayload,
  CollateralWithdrawalTransactionSubmittedPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects';
import { AuthGuard } from '@archie/api/utils/auth0';
import { GetWithdrawalLog } from '@archie/api/ledger-api/data-transfer-objects';
import { Subscribe } from '@archie/api/utils/queue';

@Controller('/v1/ledger/withdraw')
export class WithdrawController {
}

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
    return this.withdrawService.withdrawalTransactionHandler(false, payload);
  }

  @Subscribe(
    COLLATERAL_WITHDRAWAL_COMPLETED_TOPIC,
    WithdrawQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralWithdrawalCompletedHandler(
    payload: CollateralWithdrawalCompletedPayload,
  ): Promise<void> {
    return this.withdrawService.withdrawalTransactionHandler(true, payload);
  }
}
