import { Injectable } from '@nestjs/common';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarginCall } from './margin_calls.entity';
import { MarginCheck } from './margin_check.entity';
import { MathUtilService } from './utils/math.service';
import { MarginActionsCheckUtilService } from './utils/margin_actions_check.service';
import { MarginAction } from './utils/utils.interfaces';
import { MarginActionHandlersUtilService } from './utils/margin_action_handlers.service';
import { MarginNotification } from './margin_notifications.entity';

@Injectable()
export class MarginService {
  constructor(
    @InjectRepository(MarginCall)
    private marginCallsRepository: Repository<MarginCall>,
    @InjectRepository(MarginCheck)
    private marginCheckRepository: Repository<MarginCheck>,
    @InjectRepository(MarginCheck)
    private marginNotificationRepository: Repository<MarginNotification>,
    private mathUtilService: MathUtilService,
    private marginCheckUtilService: MarginActionsCheckUtilService,
    private marginActionHandlersUtilService: MarginActionHandlersUtilService,
  ) {}

  public async handleLtvUpdatedEvent(
    updatedLtv: LtvUpdatedPayload,
  ): Promise<void> {
    // TODO: Security improvements (very unlikely).
    //  Add calculation date in payload and execute logic only in case calculation date is the latest (store calculation date in margin check table)
    //   Create external ids for fireblocks txn. Reject(ignore) any updates that come before the txn is confirmed - add txn id to the ltv updated event

    const activeMarginCall: MarginCall | null =
      await this.marginCallsRepository.findOneBy({
        userId: updatedLtv.userId,
      });
    const lastMarginCheck: MarginCheck | null =
      await this.marginCheckRepository.findOneBy({
        userId: updatedLtv.userId,
      });
    const marginNotification: MarginNotification | null =
      await this.marginNotificationRepository.findOneBy({
        userId: updatedLtv.userId,
      });

    const actions: MarginAction[] = this.marginCheckUtilService.getActions(
      activeMarginCall,
      lastMarginCheck,
      marginNotification,
      updatedLtv.ltv,
      updatedLtv.calculatedOn.collateralBalance,
    );

    if (actions.length > 0) {
      await this.marginCheckRepository.upsert(
        {
          userId: updatedLtv.userId,
          ltv: updatedLtv.ltv,
          collateralBalance: updatedLtv.calculatedOn.collateralBalance,
          // TODO: compare calculation date
        },
        { conflictPaths: ['userId'] },
      );

      await this.marginActionHandlersUtilService.handle(actions, updatedLtv);
    }
  }
}
