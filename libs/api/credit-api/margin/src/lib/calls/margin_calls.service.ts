import { LiquidatedCollateralAssets, UsersLtv } from '../margin.interfaces';
import { Injectable } from '@nestjs/common';
import {
  MARGIN_CALL_COMPLETED_TOPIC,
  MARGIN_CALL_STARTED_TOPIC,
} from '@archie/api/credit-api/constants';
import { Repository } from 'typeorm';
import { MarginCall } from '../margin_calls.entity';
import { DateTime, Interval } from 'luxon';
import { MarginLtvService } from '../ltv/margin_ltv.service';
import { MarginLiquidationService } from './liquidation/margin_liquidation.service';
import { MarginNotification } from '../margin_notifications.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueService } from '@archie/api/utils/queue';
import {
  MarginCallCompletedPayload,
  MarginCallStartedPayload,
} from '@archie/api/credit-api/data-transfer-objects';

@Injectable()
export class MarginCallsService {
  CRITICAL_LTV_LIMIT = 85;
  LIQUIDATE_TO_LTV = 60;
  MARGIN_CALL_TIME_LIMIT = 72;

  constructor(
    @InjectRepository(MarginNotification)
    private marginNotificationsRepository: Repository<MarginNotification>,
    @InjectRepository(MarginCall)
    private marginCallsRepository: Repository<MarginCall>,
    private queueService: QueueService,
    private marginLtvService: MarginLtvService,
    private marginLiquidationService: MarginLiquidationService,
  ) {}

  public async completeMarginCallWithoutLiquidation(usersLtv: UsersLtv) {
    await this.marginCallsRepository.softDelete({
      userId: usersLtv.userId,
    });
    this.queueService.publish<MarginCallCompletedPayload>(
      MARGIN_CALL_COMPLETED_TOPIC,
      {
        userId: usersLtv.userId,
        liquidation: [],
        liquidationAmount: 0,
        ltv: usersLtv.ltv,
        priceForMarginCall: usersLtv.priceForMarginCall,
        priceForPartialCollateralSale: usersLtv.priceForPartialCollateralSale,
        collateralBalance: usersLtv.collateralBalance,
      },
    );
  }

  public filterUsersWithExpiredMarginCall(
    marginCalls: MarginCall[],
    usersLtv: UsersLtv[],
  ): UsersLtv[] {
    const currentTime = DateTime.utc();

    return usersLtv.filter((userLtv) => {
      const expiredMarginCall: MarginCall | undefined = marginCalls.find(
        (marginCall) => {
          const hoursPassedSinceTheStartOfMarginCall: number =
            Interval.fromDateTimes(marginCall.createdAt, currentTime).length(
              'hours',
            );

          return (
            marginCall.userId === userLtv.userId &&
            hoursPassedSinceTheStartOfMarginCall >= this.MARGIN_CALL_TIME_LIMIT
          );
        },
      );

      return expiredMarginCall !== undefined;
    });
  }

  public async handleMarginCall(
    alreadyActiveMarginCall: MarginCall | undefined,
    usersLtv: UsersLtv,
  ): Promise<void> {
    const marginCall: MarginCall =
      alreadyActiveMarginCall ??
      (await this.marginCallsRepository.save({
        userId: usersLtv.userId,
      }));

    const hoursPassedSinceTheStartOfMarginCall: number = Interval.fromDateTimes(
      marginCall.createdAt,
      DateTime.utc(),
    ).length('hours');

    if (
      hoursPassedSinceTheStartOfMarginCall >= this.MARGIN_CALL_TIME_LIMIT ||
      usersLtv.ltv >= this.CRITICAL_LTV_LIMIT
    ) {
      const liquidatedCollateralAssets: LiquidatedCollateralAssets =
        await this.completeMarginCallWithLiquidation(usersLtv, marginCall);

      const loanedBalance: number =
        usersLtv.loanedBalance - liquidatedCollateralAssets.loanRepaymentAmount;

      this.queueService.publish<MarginCallCompletedPayload>(
        MARGIN_CALL_COMPLETED_TOPIC,
        {
          userId: usersLtv.userId,
          liquidation: liquidatedCollateralAssets.liquidatedAssets.map(
            (asset) => ({
              asset: asset.asset,
              amount: asset.amount,
              price: asset.price,
            }),
          ),
          liquidationAmount: liquidatedCollateralAssets.loanRepaymentAmount,
          ltv: this.LIQUIDATE_TO_LTV,
          priceForMarginCall:
            this.marginLtvService.calculatePriceForMarginCall(loanedBalance),
          priceForPartialCollateralSale:
            this.marginLtvService.calculatePriceForCollateralSale(
              loanedBalance,
            ),
          collateralBalance:
            usersLtv.collateralBalance -
            liquidatedCollateralAssets.loanRepaymentAmount,
        },
      );
    } else if (alreadyActiveMarginCall === undefined) {
      this.queueService.publish<MarginCallStartedPayload>(
        MARGIN_CALL_STARTED_TOPIC,
        {
          userId: usersLtv.userId,
          ltv: usersLtv.ltv,
          priceForMarginCall: usersLtv.priceForMarginCall,
          priceForPartialCollateralSale: usersLtv.priceForPartialCollateralSale,
          collateralBalance: usersLtv.collateralBalance,
        },
      );
    }
  }

  private async completeMarginCallWithLiquidation(
    usersLtv: UsersLtv,
    marginCall: MarginCall,
  ): Promise<LiquidatedCollateralAssets> {
    const loanRepaymentAmount: number =
      this.marginLtvService.calculateAmountToReachLtv(
        usersLtv.loanedBalance,
        usersLtv.collateralBalance,
        this.LIQUIDATE_TO_LTV,
      );
    const assetsToLiquidate =
      await this.marginLiquidationService.getAssetsToLiquidate(
        usersLtv.userId,
        loanRepaymentAmount,
        usersLtv.collateralAllocation,
        marginCall,
      );
    await this.marginLiquidationService.liquidateAssets(
      usersLtv.userId,
      assetsToLiquidate,
    );
    await this.cleanupMarginCallAttempt(usersLtv.userId);

    return {
      loanRepaymentAmount,
      liquidatedAssets: assetsToLiquidate,
    };
  }

  private async cleanupMarginCallAttempt(userId: string): Promise<void> {
    await this.marginCallsRepository.softDelete({
      userId: userId,
    });
    await this.marginNotificationsRepository.upsert(
      {
        userId: userId,
        active: false,
        sentAtLtv: null,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }
}
