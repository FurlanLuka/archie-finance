import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { MathUtilService } from './utils/math.service';
import { MarginActionsCheckUtilService } from './utils/margin_actions_check.service';
import { MarginAction } from './utils/utils.interfaces';
import { MarginActionHandlersUtilService } from './utils/margin_action_handlers.service';
import { PerUserLtv } from './margin.interfaces';
import { MarginCallQueryDto } from '@archie/api/ltv-api/data-transfer-objects';
import { MarginCallFactory } from './utils/margin_call_factory.service';
import { MarginCall as MarginCallResponse } from '@archie/api/ltv-api/data-transfer-objects/types';
import { MarginEntitiesService } from './entities/margin_entities.service';
import { MarginCall } from './entities/margin_calls.entity';
import { MarginCheck } from './entities/margin_check.entity';
import { MarginNotification } from './entities/margin_notifications.entity';
import { GroupMap } from '@archie/api/utils/helpers';

@Injectable()
export class MarginService {
  constructor(
    private mathUtilService: MathUtilService,
    private marginCheckUtilService: MarginActionsCheckUtilService,
    private marginActionHandlersUtilService: MarginActionHandlersUtilService,
    private marginCallFactory: MarginCallFactory,
    private marginEntitiesService: MarginEntitiesService,
  ) {}

  public async getMarginCalls(
    userId: string,
    filters: MarginCallQueryDto,
  ): Promise<MarginCallResponse[]> {
    const marginCalls: MarginCall[] =
      await this.marginEntitiesService.getMarginCallsWithDeleted(
        userId,
        filters.status,
      );

    return marginCalls.map(this.marginCallFactory.create);
  }

  public async executeMarginCallChecks(
    perUserLtv: PerUserLtv[],
  ): Promise<void> {
    const userIds = perUserLtv.map((user) => user.userId);

    const [activeMarginCalls, lastMarginChecks, marginNotifications]: [
      GroupMap<MarginCall>,
      GroupMap<MarginCheck>,
      GroupMap<MarginNotification>,
    ] = await Promise.all([
      this.marginEntitiesService.getMarginCallsWithLiquidationsPerUser(userIds),
      this.marginEntitiesService.getMarginChecksPerUser(userIds),
      this.marginEntitiesService.getMarginNotificationsPerUser(userIds),
    ]);

    await Promise.all(
      perUserLtv.map(async ({ userId, ltv, ltvMeta }) => {
        const activeMarginCall: MarginCall | null =
          activeMarginCalls[userId] ?? null;

        const actions: MarginAction[] = this.marginCheckUtilService.getActions(
          activeMarginCall,
          lastMarginChecks[userId] ?? null,
          marginNotifications[userId] ?? null,
          ltv,
          ltvMeta.ledgerValue,
        );

        if (actions.length > 0) {
          await this.marginEntitiesService.upsertMarginCheck(
            userId,
            ltv,
            ltvMeta.ledgerValue,
          );

          await this.marginActionHandlersUtilService.handle(actions, {
            userId,
            ltv,
            ltvMeta,
            marginCall: activeMarginCall,
          });
        }
      }),
    );
  }
}
