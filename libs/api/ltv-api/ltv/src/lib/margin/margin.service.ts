import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { MarginCall } from './margin_calls.entity';
import { MarginCheck } from './margin_check.entity';
import { MathUtilService } from './utils/math.service';
import { MarginActionsCheckUtilService } from './utils/margin_actions_check.service';
import { MarginAction } from './utils/utils.interfaces';
import { MarginActionHandlersUtilService } from './utils/margin_action_handlers.service';
import { MarginNotification } from './margin_notifications.entity';
import { LtvMeta, PerUserLtv } from './margin.interfaces';
import { Liquidation } from '../liquidation/liquidation.entity';
import { MarginCallQueryDto } from '@archie/api/ltv-api/data-transfer-objects';
import { MarginCallFactory } from './utils/margin_call_factory.service';
import { BigNumber } from 'bignumber.js';
import {
  MarginCallStatus,
  MarginCall as MarginCallResponse,
} from '@archie/api/ltv-api/data-transfer-objects/types';
import { GroupingHelper, GroupMap } from '@archie/api/utils/helpers';

@Injectable()
export class MarginService {
  constructor(
    @InjectRepository(MarginCall)
    private marginCallsRepository: Repository<MarginCall>,
    @InjectRepository(MarginCheck)
    private marginCheckRepository: Repository<MarginCheck>,
    @InjectRepository(MarginNotification)
    private marginNotificationRepository: Repository<MarginNotification>,
    @InjectRepository(Liquidation)
    private liquidationRepository: Repository<Liquidation>,
    private mathUtilService: MathUtilService,
    private marginCheckUtilService: MarginActionsCheckUtilService,
    private marginActionHandlersUtilService: MarginActionHandlersUtilService,
    private marginCallFactory: MarginCallFactory,
  ) {}

  public async getMarginCalls(
    userId: string,
    filters: MarginCallQueryDto,
  ): Promise<MarginCallResponse[]> {
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

  public async reducePendingLiquidationAmountWithLookup(
    userId: string,
    creditUtilization: number,
    ledgerValue: number,
  ): Promise<LtvMeta> {
    const liquidations: Liquidation[] = await this.liquidationRepository.find({
      where: {
        marginCall: {
          userId,
        },
      },
      relations: {
        marginCall: true,
      },
    });

    const pendingLiquidatedCreditUtilization = liquidations.reduce(
      (pendingValue, liquidation) => {
        return !liquidation.isCreditUtilizationUpdated
          ? BigNumber(pendingValue).plus(liquidation.amount)
          : pendingValue;
      },
      '0',
    );
    const pendingLiquidatedLedgerValue = liquidations.reduce(
      (pendingValue, liquidation) => {
        return !liquidation.isLedgerValueUpdated
          ? BigNumber(pendingValue).plus(liquidation.amount)
          : pendingValue;
      },
      '0',
    );

    return {
      creditUtilization: BigNumber(creditUtilization)
        .minus(pendingLiquidatedCreditUtilization)
        .toNumber(),
      ledgerValue: BigNumber(ledgerValue)
        .minus(pendingLiquidatedLedgerValue)
        .toNumber(),
    };
  }

  public reducePendingLiquidationAmount(
    userId: string,
    creditUtilization: number,
    ledgerValue: number,
    liquidations: Liquidation[],
  ): LtvMeta {
    const pendingLiquidatedCreditUtilization = liquidations.reduce(
      (pendingValue, liquidation) => {
        return !liquidation.isCreditUtilizationUpdated
          ? BigNumber(pendingValue).plus(liquidation.amount)
          : pendingValue;
      },
      '0',
    );
    const pendingLiquidatedLedgerValue = liquidations.reduce(
      (pendingValue, liquidation) => {
        return !liquidation.isLedgerValueUpdated
          ? BigNumber(pendingValue).plus(liquidation.amount)
          : pendingValue;
      },
      '0',
    );

    return {
      creditUtilization: BigNumber(creditUtilization)
        .minus(pendingLiquidatedCreditUtilization)
        .toNumber(),
      ledgerValue: BigNumber(ledgerValue)
        .minus(pendingLiquidatedLedgerValue)
        .toNumber(),
    };
  }

  public async acknowledgeLiquidationCollateralBalanceUpdate(
    liquidationId: string,
  ): Promise<void> {
    await this.liquidationRepository.update(
      {
        id: liquidationId,
      },
      {
        isLedgerValueUpdated: true,
      },
    );
  }

  public async acknowledgeLiquidationCreditBalanceUpdate(
    liquidationId: string,
  ): Promise<void> {
    await this.liquidationRepository.update(
      {
        id: liquidationId,
      },
      {
        isCreditUtilizationUpdated: true,
      },
    );
  }

  public async executeMarginCallCheck(
    userId: string,
    ltv: number,
    ltvMeta: LtvMeta,
  ): Promise<void> {
    const activeMarginCall: MarginCall | null =
      await this.marginCallsRepository.findOne({
        where: {
          userId: userId,
        },
        relations: {
          liquidation: true,
        },
      });

    const lastMarginCheck: MarginCheck | null =
      await this.marginCheckRepository.findOneBy({
        userId,
      });
    const marginNotification: MarginNotification | null =
      await this.marginNotificationRepository.findOneBy({
        userId,
      });

    const actions: MarginAction[] = this.marginCheckUtilService.getActions(
      activeMarginCall,
      lastMarginCheck,
      marginNotification,
      ltv,
      ltvMeta.ledgerValue,
    );

    if (actions.length > 0) {
      await this.upsertMarginCheck(userId, ltv, ltvMeta.ledgerValue);

      await this.marginActionHandlersUtilService.handle(actions, {
        userId,
        ltv,
        ltvMeta,
        marginCall: activeMarginCall,
      });
    }
  }

  public async executeMarginCallChecks(
    perUserLtv: PerUserLtv[],
  ): Promise<void> {
    const userIds = perUserLtv.map((user) => user.userId);

    const [activeMarginCalls, lastMarginChecks, marginNotifications]: [
      MarginCall[],
      MarginCheck[],
      MarginNotification[],
    ] = await Promise.all([
      this.marginCallsRepository.find({
        where: {
          userId: In(userIds),
        },
        relations: {
          liquidation: true,
        },
      }),
      this.marginCheckRepository.findBy({
        userId: In(userIds),
      }),
      this.marginNotificationRepository.findBy({
        userId: In(userIds),
      }),
    ]);
    const activeMarginCallsPerUser: GroupMap<MarginCall> = GroupingHelper.mapBy(
      activeMarginCalls,
      (marginCall) => marginCall.userId,
    );
    const lastMarginCheckPerUser: GroupMap<MarginCheck> = GroupingHelper.mapBy(
      lastMarginChecks,
      (marginCheck) => marginCheck.userId,
    );
    const marginNotificationPerUser: GroupMap<MarginNotification> =
      GroupingHelper.mapBy(
        marginNotifications,
        (marginNotification) => marginNotification.userId,
      );

    await Promise.all(
      perUserLtv.map(async ({ userId, ltv, ltvMeta }) => {
        const activeMarginCall: MarginCall | null =
          activeMarginCallsPerUser[userId] ?? null;

        const actions: MarginAction[] = this.marginCheckUtilService.getActions(
          activeMarginCall,
          lastMarginCheckPerUser[userId] ?? null,
          marginNotificationPerUser[userId] ?? null,
          ltv,
          ltvMeta.ledgerValue,
        );

        if (actions.length > 0) {
          await this.upsertMarginCheck(userId, ltv, ltvMeta.ledgerValue);

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

  private async upsertMarginCheck(
    userId: string,
    ltv: number,
    ledgerValue: number,
  ): Promise<void> {
    await this.marginCheckRepository.upsert(
      {
        userId,
        ltv,
        ledgerValue: ledgerValue,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }
}
