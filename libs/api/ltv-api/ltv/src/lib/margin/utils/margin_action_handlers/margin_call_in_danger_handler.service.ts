import { Injectable } from '@nestjs/common';
import { QueueService } from '@archie/api/utils/queue';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LTV_LIMIT_APPROACHING_TOPIC } from '@archie/api/ltv-api/constants';
import { LtvLimitApproachingPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { MarginCallPriceFactory } from './margin_call_price.factory';
import { MarginNotification } from '../../margin_notifications.entity';
import { MarginActionHandlerPayload } from '../utils.interfaces';

@Injectable()
export class MarginCallInDangerHandlerService {
  constructor(
    private queueService: QueueService,
    @InjectRepository(MarginNotification)
    private marginNotificationsRepository: Repository<MarginNotification>,
    private marginCallPriceFactory: MarginCallPriceFactory,
  ) {}

  public async send(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<MarginActionHandlerPayload> {
    this.queueService.publish<LtvLimitApproachingPayload>(
      LTV_LIMIT_APPROACHING_TOPIC,
      {
        userId: actionPayload.userId,
        ltv: actionPayload.ltv,
        ...this.marginCallPriceFactory.getMarginCallPrices(
          actionPayload.ltvMeta,
        ),
      },
    );
    await this.marginNotificationsRepository.upsert(
      {
        userId: actionPayload.userId,
        active: true,
        sentAtLtv: 0,
      },
      {
        conflictPaths: ['userId'],
      },
    );

    return actionPayload;
  }

  public async reset(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<MarginActionHandlerPayload> {
    await this.marginNotificationsRepository.upsert(
      {
        userId: actionPayload.userId,
        active: false,
        sentAtLtv: null,
      },
      {
        conflictPaths: ['userId'],
        skipUpdateIfNoValuesChanged: true,
      },
    );

    return actionPayload;
  }
}
