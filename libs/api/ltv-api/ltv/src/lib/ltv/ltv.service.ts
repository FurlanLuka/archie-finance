import { Injectable } from '@nestjs/common';
import { LtvDto, LtvStatus } from './ltv.dto';
import { QueueService } from '@archie/api/utils/queue';
import { LtvUtilService } from '../utils/ltv.service';
import { CreditAssetUtilService } from '../utils/credit_asset.service';
import { CollateralValue, CreditAssets } from '../utils/utils.interfaces';
import { CollateralValueUtilService } from '../utils/collateral_value.service';

@Injectable()
export class LtvService {
  constructor(
    private queueService: QueueService,
    private creditAssetsUtilService: CreditAssetUtilService,
    private ltvUtilService: LtvUtilService,
    private collateralValueUtilService: CollateralValueUtilService,
  ) {}

  async getCurrentLtv(userId: string): Promise<LtvDto> {
    const creditAssets: CreditAssets =
      await this.creditAssetsUtilService.getCreditInfo(userId);

    const collateralValue: CollateralValue =
      this.collateralValueUtilService.getCollateralValue(
        creditAssets.collateral,
        creditAssets.assetPrices,
      );
    const ltv: number = this.ltvUtilService.calculateLtv(
      creditAssets,
      collateralValue.collateralBalance,
    );
    const ltvStatus: LtvStatus = this.ltvUtilService.getLtvStatus(ltv);

    return {
      ltv,
      status: ltvStatus,
    };
  }
}
