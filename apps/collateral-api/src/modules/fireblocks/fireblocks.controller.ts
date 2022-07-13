import { Controller } from '@nestjs/common';
import { FireblocksService } from './fireblocks.service';
import {
  COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE,
  MARGIN_CALL_COMPLETED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CollateralWithdrawInitializedDto,
  LiquidateAssetsDto,
} from './fireblocks.dto';
import { SERVICE_QUEUE_NAME } from '@archie/api/collateral-api/constants';

@Controller()
export class FireblocksQueueController {
  constructor(private fireblocksService: FireblocksService) {}

  @Subscribe(COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE, SERVICE_QUEUE_NAME)
  async collateralWithdrawInitializedHandler(
    payload: CollateralWithdrawInitializedDto,
  ): Promise<void> {
    await this.fireblocksService.withdrawAsset(payload);
  }
  @Subscribe(MARGIN_CALL_COMPLETED_EXCHANGE, SERVICE_QUEUE_NAME)
  async marginCallCompletedLiquidationHandler(
    payload: LiquidateAssetsDto,
  ): Promise<void> {
    console.log('ma kaki pejlod', payload);
    await this.fireblocksService.liquidateAssets(payload);
  }
}
