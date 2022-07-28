import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
  MARGIN_CALL_COMPLETED_TOPIC,
} from '@archie/api/credit-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/collateral-api/constants';
import {
  CollateralWithdrawInitializedDto,
  LiquidateAssetsDto,
} from '@archie/api/collateral-api/fireblocks';
import { UserVaultAccountService } from './user-vault-account.service';

@Controller()
export class FireblocksQueueController {
  constructor(private userVaultAccountService: UserVaultAccountService) {}

  @Subscribe(COLLATERAL_WITHDRAW_INITIALIZED_TOPIC, SERVICE_QUEUE_NAME)
  async collateralWithdrawInitializedHandler(
    payload: CollateralWithdrawInitializedDto,
  ): Promise<void> {
    await this.userVaultAccountService.withdrawAsset(payload);
  }
  @Subscribe(MARGIN_CALL_COMPLETED_TOPIC, SERVICE_QUEUE_NAME)
  async marginCallCompletedLiquidationHandler(
    payload: LiquidateAssetsDto,
  ): Promise<void> {
    await this.userVaultAccountService.liquidateAssets(payload);
  }
}
