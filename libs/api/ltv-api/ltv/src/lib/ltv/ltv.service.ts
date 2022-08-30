import { Injectable } from '@nestjs/common';
import { LtvDto, LtvStatus } from './ltv.dto';
import { QueueService } from '@archie/api/utils/queue';
import { LtvUtilService } from '../utils/ltv.service';
import { CreditAssetUtilService } from '../utils/credit_asset.service';
import { CreditAssets } from '../utils/utils.interfaces';

@Injectable()
export class LtvService {
  constructor(
    private queueService: QueueService,
    private creditAssetsUtilService: CreditAssetUtilService,
    private ltvUtilService: LtvUtilService,
  ) {}

  async getCurrentLtv(userId: string): Promise<LtvDto> {
    const creditAssets: CreditAssets =
      await this.creditAssetsUtilService.getCreditInfo(userId);

    const ltv: number = this.ltvUtilService.calculateLtv(creditAssets);
    const ltvStatus: LtvStatus = this.ltvUtilService.getLtvStatus(ltv);

    return {
      ltv,
      status: ltvStatus,
    };
  }
}
