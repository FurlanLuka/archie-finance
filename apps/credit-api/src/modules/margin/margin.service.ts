import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credit } from '../credit/credit.entity';
import { In, Repository } from 'typeorm';
import { LiquidationLogs } from './liquidation_logs.entity';
import { MarginCalls } from './margin_calls.entity';
import { MarginNotifications } from './margin_notifications.entity';
import { InternalApiService } from '@archie-microservices/internal-api';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  CollateralValue,
  GetCollateralValueResponse,
} from '@archie-microservices/api-interfaces/collateral';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { UsersLtv } from './margin.interfaces';
import {
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { DateTime, Interval } from 'luxon';

@Injectable()
export class MarginService {
  LTV_LIMIT = 75;
  CRITICAL_LTV_LIMIT = 85;
  SAFE_LTV = 0.6;
  LTV_ALERT_LIMITS = [65, 70, 73];

  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    @InjectRepository(LiquidationLogs)
    private liquidationLogsRepository: Repository<LiquidationLogs>,
    @InjectRepository(MarginCalls)
    private marginCallsRepository: Repository<MarginCalls>,
    @InjectRepository(MarginNotifications)
    private marginNotificationsRepository: Repository<MarginNotifications>,
    private internalApiService: InternalApiService,
    private amqpConnection: AmqpConnection,
  ) {}

  public async checkMargin(userIds: string[]): Promise<void> {
    const credits: Credit[] = await this.creditRepository.find({
      where: {
        userId: In(userIds),
      },
    });
    const activeMarginCalls: MarginCalls[] =
      await this.marginCallsRepository.find({
        where: {
          userId: In(userIds),
        },
      });
    const liquidationLogs: LiquidationLogs[] =
      await this.liquidationLogsRepository.find({
        where: {
          userId: In(userIds),
        },
      });

    const userLtvs: UsersLtv[] = await Promise.all(
      userIds.map(async (userId: string) =>
        this.calculateUsersLtv(userId, credits, liquidationLogs),
      ),
    );
    await Promise.all(
      userLtvs.map(async (usersLtv: UsersLtv) => {
        const alreadyActiveMarginCall: MarginCalls | undefined =
          activeMarginCalls.find(
            (marginCall) => marginCall.userId === usersLtv.userId,
          );

        if (usersLtv.ltv < this.LTV_LIMIT) {
          if (alreadyActiveMarginCall !== undefined) {
            await this.completeMarginCallWithoutLiquidation(usersLtv);
          } else {
            await this.checkIfApproachingLtvLimits(
              usersLtv.userId,
              usersLtv.ltv,
            );
          }
        } else {
          const marginCall: MarginCalls =
            alreadyActiveMarginCall ??
            (await this.marginCallsRepository.save({
              userId: usersLtv.userId,
            }));

          const hoursPassedSinceTheStartOfMarginCall: number =
            Interval.fromDateTimes(marginCall.createdAt, DateTime.utc()).length(
              'hours',
            );

          if (
            hoursPassedSinceTheStartOfMarginCall >= 72 ||
            usersLtv.ltv >= this.CRITICAL_LTV_LIMIT
          ) {
            await this.completeMarginCallWithLiquidation(usersLtv, marginCall);
          } else if (alreadyActiveMarginCall === undefined) {
            this.amqpConnection.publish(MARGIN_CALL_STARTED_EXCHANGE.name, '', {
              userId: usersLtv.userId,
            });
          }
        }
      }),
    );
  }

  private async calculateUsersLtv(
    userId: string,
    credits: Credit[],
    liquidationLogs: LiquidationLogs[],
  ): Promise<UsersLtv> {
    const usersCollateral: GetCollateralValueResponse =
      await this.internalApiService.getUserCollateralValue(userId);
    // TODO: move collateral api to credit api

    const totalCollateralValue: number = usersCollateral.reduce(
      (collateralPrice: number, collateralValue: CollateralValue) =>
        collateralPrice + collateralValue.price,
      0,
    );

    const creditBalance: Credit = credits.find(
      (credit: Credit) => credit.userId === userId,
    );

    const usersLiquidationLogs: LiquidationLogs[] = liquidationLogs.filter(
      (liquidationLog: LiquidationLogs) => liquidationLog.userId === userId,
    );
    const usersLiquidationLogsSum: number = usersLiquidationLogs.reduce(
      (liquidationSum: number, liquidationLog) =>
        liquidationSum + liquidationLog.price,
      0,
    );

    const spentBalance: number =
      creditBalance.totalCredit - creditBalance.availableCredit;
    const loanedBalance: number = spentBalance - usersLiquidationLogsSum;

    return {
      userId,
      ltv: (loanedBalance / totalCollateralValue) * 100,
      collateralBalance: totalCollateralValue,
      loanedBalance: loanedBalance,
      collateralAllocation: usersCollateral,
    };
  }

  private async completeMarginCallWithoutLiquidation(usersLtv: UsersLtv) {
    await this.marginCallsRepository.softDelete({
      userId: usersLtv.userId,
    });
    this.amqpConnection.publish(MARGIN_CALL_COMPLETED_EXCHANGE.name, '', {
      userId: usersLtv.userId,
      liquidation: [],
    });
    // TODO: Reactivate card - EVENT handled by rize
    // TODO: send email that margin is now ok, 72 hour limit ok --- Prob remove this event and just handle margin call one on the mail service
  }

  private async completeMarginCallWithLiquidation(
    usersLtv: UsersLtv,
    marginCall: MarginCalls,
  ) {
    const loanRepaymentAmount: number = this.calculateAmountToReachSafeLtv(
      usersLtv.loanedBalance,
      usersLtv.collateralBalance,
    );
    const assetsToLiquidate = await this.getAssetsToLiquidate(
      usersLtv.userId,
      loanRepaymentAmount,
      usersLtv.collateralAllocation,
      marginCall,
    );
    await this.liquidateAssets(usersLtv.userId, assetsToLiquidate);
    await this.cleanupMarginCallAttempt(usersLtv.userId);
  }

  private calculateAmountToReachSafeLtv(
    loanedBalance: number,
    collateralBalance: number,
  ) {
    return (
      (loanedBalance - this.SAFE_LTV * collateralBalance) / (1 - this.SAFE_LTV)
    );
  }

  private async liquidateAssets(
    userId: string,
    assetsToLiquidate: Partial<LiquidationLogs>[],
  ) {
    this.amqpConnection.publish(MARGIN_CALL_COMPLETED_EXCHANGE.name, '', {
      userId,
      liquidation: assetsToLiquidate.map((asset) => ({
        asset: asset.asset,
        amount: asset.amount,
        price: asset.price,
      })),
    });
    // TODO: update collateral amount once collateral entity is moved
    await this.liquidationLogsRepository.save(assetsToLiquidate);
  }

  private async getAssetsToLiquidate(
    userId: string,
    amount: number,
    collateralAssets: GetCollateralValueResponse,
    marginCall: MarginCalls,
  ): Promise<Partial<LiquidationLogs>[]> {
    const sortedCollateralAssetsByAllocation: GetCollateralValueResponse =
      collateralAssets
        .slice()
        .sort((a: CollateralValue, b: CollateralValue) =>
          a.price >= b.price ? -1 : 1,
        );

    let targetLiquidationAmount: number = amount;

    return sortedCollateralAssetsByAllocation
      .map((collateralValue): Partial<LiquidationLogs> => {
        if (targetLiquidationAmount > 0) {
          let newCollateralAssetPrice: number =
            collateralValue.price - targetLiquidationAmount;

          if (newCollateralAssetPrice >= 0) {
            targetLiquidationAmount -=
              collateralValue.price - newCollateralAssetPrice;
          } else {
            newCollateralAssetPrice = 0;
            targetLiquidationAmount -= collateralValue.price;
          }

          const assetAmountPerUnit: number =
            collateralValue.price / collateralValue.assetAmount;
          const newCollateralAssetAmount: number =
            newCollateralAssetPrice / assetAmountPerUnit;

          return {
            asset: collateralValue.asset,
            amount: collateralValue.assetAmount - newCollateralAssetAmount,
            userId,
            marginCall: marginCall,
            price: collateralValue.price - newCollateralAssetPrice,
          };
        }

        return {
          asset: collateralValue.asset,
          amount: 0,
          userId,
          marginCall: marginCall,
          price: 0,
        };
      })
      .filter((liquidatedAsset) => liquidatedAsset.amount > 0);
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

  private async checkIfApproachingLtvLimits(userId: string, ltv: number) {
    if (ltv >= Math.min(...this.LTV_ALERT_LIMITS)) {
      const marginNotifications: MarginNotifications | null =
        await this.marginNotificationsRepository.findOne({
          where: {
            userId,
          },
        });

      const shouldSendNotification: boolean = this.LTV_ALERT_LIMITS.map(
        (limit: number, index: number): boolean => {
          if (
            (marginNotifications === null ||
              marginNotifications.active === false ||
              marginNotifications.sentAtLtv < limit) &&
            ltv >= limit &&
            ltv < (this.LTV_ALERT_LIMITS[index + 1] ?? this.LTV_LIMIT)
          ) {
            return true;
          }
          return false;
        },
      ).some((alert: boolean) => alert === true);

      if (shouldSendNotification) {
        // TODO: rename event
        this.amqpConnection.publish('EMAIL_SENDING_REQUESTED', '', {
          userId,
          template_id: 1,
          ltv: ltv,
        });
        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: true,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['userId'],
          },
        );
      }
    } else {
      await this.marginNotificationsRepository.upsert(
        {
          userId: userId,
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
}
