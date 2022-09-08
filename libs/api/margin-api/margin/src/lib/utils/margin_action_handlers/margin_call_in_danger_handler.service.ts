import { Injectable } from '@nestjs/common';
import { QueueService } from '@archie/api/utils/queue';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LTV_LIMIT_APPROACHING_TOPIC } from '@archie/api/margin-api/constants';
import { LtvLimitApproachingPayload } from '@archie/api/margin-api/data-transfer-objects';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { MarginCallPriceFactory } from './margin_call_price.factory';
import { MarginNotification } from '../../margin_notifications.entity';

@Injectable()
export class MarginCallInDangerHandlerService {
  constructor(
    private queueService: QueueService,
    @InjectRepository(MarginNotification)
    private marginNotificationsRepository: Repository<MarginNotification>,
    private marginCallPriceFactory: MarginCallPriceFactory,
  ) {}

  public async send(ltv: LtvUpdatedPayload): Promise<void> {
    this.queueService.publish<LtvLimitApproachingPayload>(
      LTV_LIMIT_APPROACHING_TOPIC,
      {
        userId: ltv.userId,
        ltv: ltv.ltv,
        ...this.marginCallPriceFactory.getMarginCallPrices(ltv.calculatedOn),
      },
    );
    await this.marginNotificationsRepository.upsert(
      {
        userId: ltv.userId,
        active: true,
        sentAtLtv: 0,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }

  public async reset(ltv: LtvUpdatedPayload): Promise<void> {
    await this.marginNotificationsRepository.upsert(
      {
        userId: ltv.userId,
        active: false,
        sentAtLtv: null,
      },
      {
        conflictPaths: ['userId'],
        skipUpdateIfNoValuesChanged: true,
      },
    );
  }
}
