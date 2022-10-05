import { Injectable } from '@nestjs/common';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, LessThan, Not, Repository, UpdateResult } from 'typeorm';
import { MarginCall } from './margin_calls.entity';
import { MarginCheck } from './margin_check.entity';
import { MathUtilService } from './utils/math.service';
import { MarginActionsCheckUtilService } from './utils/margin_actions_check.service';
import { MarginAction } from './utils/utils.interfaces';
import { MarginActionHandlersUtilService } from './utils/margin_action_handlers.service';
import { MarginNotification } from './margin_notifications.entity';
import {
  MarginCallQueryDto,
  MarginCallsDto,
  MarginCallStatus,
} from './margin.dto';
import { MarginCallFactory } from './utils/margin_call_factory.service';

@Injectable()
export class MarginService {
  constructor(
    @InjectRepository(MarginCall)
    private marginCallsRepository: Repository<MarginCall>,
    @InjectRepository(MarginCheck)
    private marginCheckRepository: Repository<MarginCheck>,
    @InjectRepository(MarginNotification)
    private marginNotificationRepository: Repository<MarginNotification>,
    private mathUtilService: MathUtilService,
    private marginCheckUtilService: MarginActionsCheckUtilService,
    private marginActionHandlersUtilService: MarginActionHandlersUtilService,
    private marginCallFactory: MarginCallFactory,
  ) {}

  public async getMarginCalls(
    userId: string,
    filters: MarginCallQueryDto,
  ): Promise<MarginCallsDto[]> {
    const statusFilter = {
      [MarginCallStatus.active]: IsNull(),
      [MarginCallStatus.completed]: Not(IsNull()),
    };
    const marginCalls: MarginCall[] = await this.marginCallsRepository.find({
      where: {
        userId,
        deletedAt:
          filters.status === null ? undefined : statusFilter[filters.status],
      },
      withDeleted: true,
    });

    return marginCalls.map(this.marginCallFactory.create);
  }

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
      const isMarginCheckUpdated: boolean = await this.upsertMarginCheck(
        updatedLtv,
        lastMarginCheck ?? null,
      );

      if (isMarginCheckUpdated) {
        await this.marginActionHandlersUtilService.handle(actions, updatedLtv);
      }
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

        if (actions.length > 0) {
          const isMarginCheckUpdated: boolean = await this.upsertMarginCheck(
            updatedLtv,
            lastMarginCheck ?? null,
          );

          if (isMarginCheckUpdated) {
            await this.marginActionHandlersUtilService.handle(
              actions,
              updatedLtv,
            );
          }
        }
      }),
    );
  }

  private async upsertMarginCheck(
    ltv: LtvUpdatedPayload,
    lastMarginCheck: MarginCheck | null,
  ): Promise<boolean> {
    if (lastMarginCheck === null) {
      await this.marginCheckRepository.insert({
        userId: ltv.userId,
        ltv: ltv.ltv,
        collateralBalance: ltv.calculatedOn.collateralBalance,
        ltvCalculatedAt: ltv.calculatedOn.calculatedAt,
      });

      return true;
    }
    const updateResult: UpdateResult = await this.marginCheckRepository.update(
      {
        userId: ltv.userId,
        ltvCalculatedAt: LessThan(ltv.calculatedOn.calculatedAt),
      },
      {
        ltv: ltv.ltv,
        collateralBalance: ltv.calculatedOn.collateralBalance,
        ltvCalculatedAt: ltv.calculatedOn.calculatedAt,
      },
    );

    return <number>updateResult.affected > 0;
  }
}
