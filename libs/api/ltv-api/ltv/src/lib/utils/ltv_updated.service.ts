import { Injectable, Logger } from '@nestjs/common';
import { CreditAssetUtilService } from './credit_asset.service';
import { LtvUtilService } from './ltv.service';
import { QueueService } from '@archie/api/utils/queue';
import { CreditAssets } from './utils.interfaces';
import { LTV_UPDATED_TOPIC } from '@archie/api/ltv-api/constants';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';

@Injectable()
export class LtvUpdatedUtilService {
  constructor(
    private creditAssetUtilService: CreditAssetUtilService,
    private ltvUtilService: LtvUtilService,
    private queueService: QueueService,
  ) {}
  public async publishLtvUpdatedEvent(userId: string): Promise<void> {
    try {
      const creditAssets: CreditAssets =
        await this.creditAssetUtilService.getCreditInfo(userId);

      const ltv: number = this.ltvUtilService.calculateLtv(creditAssets);

      this.queueService.publish<LtvUpdatedPayload>(LTV_UPDATED_TOPIC, {
        userId,
        ltv,
      });
    } catch (error) {
      Logger.error(`Problem publishing ${LTV_UPDATED_TOPIC} event`, error);
    }
  }
}
