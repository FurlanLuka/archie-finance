import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  COLLATERAL_DEPOSIT_COMPLETED_TOPIC,
  COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
} from '@archie/api/credit-api/constants';
import { CollateralWithdrawInitializedDto } from '@archie/api/collateral-api/fireblocks';
import { SERVICE_QUEUE_NAME } from '@archie/api/ltv-api/constants';
import { CreditService } from './credit.service';
import { CollateralDepositCompletedPayload } from '@archie/api/credit-api/data-transfer-objects';

@Controller()
export class CreditQueueController {
  CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-credit`;

  constructor(private collateralService: CreditService) {}

  @Subscribe(
    COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
    CreditQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralWithdrawInitializedHandler(
    payload: CollateralWithdrawInitializedDto,
  ): Promise<void> {
    await this.collateralService.handleCollateralWithdrawInitializedEvent(
      payload,
    );
  }

  @Subscribe(
    COLLATERAL_DEPOSIT_COMPLETED_TOPIC,
    CreditQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralDepositCompletedHandler(
    payload: CollateralDepositCompletedPayload,
  ): Promise<void> {
    await this.collateralService.handleCollateralDepositCompletedEvent(payload);
  }

  // TODO: Add failed events
  // TODO: Migrate existing collateral balances

  // TODO: Add another event for withdrawal fees + update collateral api with fee handling
}
