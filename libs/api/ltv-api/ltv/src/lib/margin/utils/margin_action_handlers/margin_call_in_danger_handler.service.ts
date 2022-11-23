import { Injectable } from '@nestjs/common';
import { QueueService } from '@archie/api/utils/queue';
import { MARGIN_CALL_LTV_LIMIT_APPROACHING_TOPIC } from '@archie/api/ltv-api/constants';
import { MarginCallPriceFactory } from './margin_call_price.factory';
import { MarginActionHandlerPayload } from '../utils.interfaces';
import { MarginEntitiesService } from '../../entities/margin_entities.service';

@Injectable()
export class MarginCallInDangerHandlerService {
  constructor(
    private queueService: QueueService,
    private marginEntitiesService: MarginEntitiesService,
    private marginCallPriceFactory: MarginCallPriceFactory,
  ) {}

  public async send(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<MarginActionHandlerPayload> {
    this.queueService.publishEvent(MARGIN_CALL_LTV_LIMIT_APPROACHING_TOPIC, {
      userId: actionPayload.userId,
      ltv: actionPayload.ltv,
      ...this.marginCallPriceFactory.getMarginCallPrices(actionPayload.ltvMeta),
    });
    await this.marginEntitiesService.rememberMarginNotificationSent(
      actionPayload.userId,
      actionPayload.ltv,
    );

    return actionPayload;
  }

  public async reset(
    actionPayload: MarginActionHandlerPayload,
  ): Promise<MarginActionHandlerPayload> {
    await this.marginEntitiesService.resetMarginNotifications(
      actionPayload.userId,
    );

    return actionPayload;
  }
}
