import { Injectable } from '@nestjs/common';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  public async handleMultipleLtvsUpdatedEvent(
    updatedLtvs: LtvUpdatedPayload[],
  ): Promise<void> {
    const userIds: string[] = updatedLtvs.map((ltv) => ltv.userId);

    const activeMarginCalls: MarginCall[] =
      await this.marginCallsRepository.findBy({
        userId: In(userIds),
      });
    const lastMarginCheckss: MarginCheck[] =
      await this.marginCheckRepository.findBy({
        userId: In(userIds),
      });
    const marginNotifications: MarginNotification[] =
      await this.marginNotificationRepository.findBy({
        userId: In(userIds),
      });

    await Promise.all(
      userIds.map(async (userId: string) => {
        const activeMarginCall: MarginCall | undefined = activeMarginCalls.find(
          (marginCall) => marginCall.userId === userId,
        );
        const lastMarginCheck: MarginCheck | undefined = lastMarginCheckss.find(
          (marginCheck) => marginCheck.userId === userId,
        );
        const marginNotification: MarginNotification | undefined =
          marginNotifications.find(
            (marginNotif) => marginNotif.userId === userId,
          );
        const updatedLtv: LtvUpdatedPayload = <LtvUpdatedPayload>(
          updatedLtvs.find((ltv) => ltv.userId === userId)
        );

        const actions: MarginAction[] = this.marginCheckUtilService.getActions(
          activeMarginCall ?? null,
          lastMarginCheck ?? null,
          marginNotification ?? null,
          updatedLtv.ltv,
          updatedLtv.calculatedOn.collateralBalance,
        );

        await this.marginActionHandlersUtilService.handle(actions, updatedLtv);

        if (actions.length > 0) {
          await this.marginCheckRepository.upsert(
            {
              userId: updatedLtv.userId,
              ltv: updatedLtv.ltv,
              collateralBalance: updatedLtv.calculatedOn.collateralBalance,
            },
            { conflictPaths: ['userId'] },
          );
        }
      }),
    );
  }
}
