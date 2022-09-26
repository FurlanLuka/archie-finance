import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  COLLATERAL_LIQUIDATION_INITIATED_TOPIC,
  COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
} from '@archie/api/credit-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/collateral-api/constants';
import { UserVaultAccountService } from './user-vault-account.service';
import {
  CollateralLiquidationInitiatedPayload,
  CollateralWithdrawInitializedPayload,
} from '@archie/api/credit-api/data-transfer-objects';

@Controller()
export class UserVaultQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-user-vault`;

  constructor(private userVaultAccountService: UserVaultAccountService) {}

  @Subscribe(
    COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
    UserVaultQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralWithdrawInitializedHandler(
    payload: CollateralWithdrawInitializedPayload,
  ): Promise<void> {
    await this.userVaultAccountService.withdrawAsset(payload);
  }
  @Subscribe(
    COLLATERAL_LIQUIDATION_INITIATED_TOPIC,
    UserVaultQueueController.CONTROLLER_QUEUE_NAME,
  )
  async marginCallCompletedLiquidationHandler(
    payload: CollateralLiquidationInitiatedPayload,
  ): Promise<void> {
    await this.userVaultAccountService.liquidateAssets(payload);
  }
}
