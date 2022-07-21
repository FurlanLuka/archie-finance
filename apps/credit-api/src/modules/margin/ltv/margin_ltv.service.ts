import { Credit } from '../../credit/credit.entity';
import { LiquidationLog } from '../liquidation_logs.entity';
import { UsersLtv } from '../margin.interfaces';
import { CollateralValue } from '@archie/api/utils/interfaces/collateral';
import { Injectable } from '@nestjs/common';
import { MarginNotification } from '../margin_notifications.entity';
import { LTV_LIMIT_APPROACHING_EXCHANGE } from '@archie/api/credit-api/constants';
import { Repository } from 'typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Collateral } from '../../collateral/collateral.entity';
import { GetAssetPricesResponse } from '@archie/api/utils/interfaces/asset_price';
import { CollateralValueService } from '../../collateral/value/collateral_value.service';

@Injectable()
export class MarginLtvService {
  LTV_ALERT_LIMITS = [65, 70, 73];
  LTV_LIMIT = 75;
  COLLATERAL_SALE_LTV_LIMIT = 85;

  constructor(
    @InjectRepository(MarginNotification)
    private marginNotificationsRepository: Repository<MarginNotification>,
    private amqpConnection: AmqpConnection,
    private collateralValueService: CollateralValueService,
  ) {}

  public calculateUsersLtv(
    userId: string,
    credits: Credit[],
    liquidationLogs: LiquidationLog[],
    collaterals: Collateral[],
    assetPrices: GetAssetPricesResponse,
  ): UsersLtv {
    const usersCollateral: Collateral[] = collaterals.filter(
      (collateral: Collateral) => collateral.userId === userId,
    );
    const usersCollateralValue =
      this.collateralValueService.getUserCollateralValue(
        usersCollateral,
        assetPrices,
      );

    const doesUserHaveOnlyUsdc: boolean =
      usersCollateralValue.some(
        (collateralValue) =>
          collateralValue.asset !== 'USDC' && collateralValue.assetAmount > 0,
      ) === false;

    const totalCollateralValue: number = usersCollateralValue.reduce(
      (collateralPrice: number, collateralValue: CollateralValue) =>
        collateralPrice + collateralValue.price,
      0,
    );

    const creditBalance: Credit = credits.find(
      (credit: Credit) => credit.userId === userId,
    );

    const usersLiquidationLogs: LiquidationLog[] = liquidationLogs.filter(
      (liquidationLog: LiquidationLog) => liquidationLog.userId === userId,
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
      collateralAllocation: usersCollateralValue,
      userOnlyHasStableCoins: doesUserHaveOnlyUsdc,
      priceForMarginCall: this.calculatePriceForMarginCall(loanedBalance),
      priceForPartialCollateralSale:
        this.calculatePriceForCollateralSale(loanedBalance),
    };
  }

  public calculatePriceForMarginCall(loanedBalance: number): number {
    return loanedBalance / (this.LTV_LIMIT / 100);
  }

  public calculatePriceForCollateralSale(loanedBalance: number): number {
    return loanedBalance / (this.COLLATERAL_SALE_LTV_LIMIT / 100);
  }

  public async checkIfApproachingLtvLimits(usersLtv: UsersLtv) {
    const {
      ltv,
      userOnlyHasStableCoins,
      userId,
      priceForMarginCall,
      priceForPartialCollateralSale,
      collateralBalance,
    } = usersLtv;

    if (ltv >= this.LTV_ALERT_LIMITS[0] && !userOnlyHasStableCoins) {
      const marginNotifications: MarginNotification | null =
        await this.marginNotificationsRepository.findOne({
          where: {
            userId,
          },
        });

      const shouldSendNotification: boolean = this.LTV_ALERT_LIMITS.map(
        (limit: number, index: number): boolean => {
          const marginNotificationNotSentYet: boolean =
            marginNotifications === null ||
            marginNotifications.active === false ||
            marginNotifications.sentAtLtv < limit;

          return (
            marginNotificationNotSentYet &&
            ltv >= limit &&
            ltv < (this.LTV_ALERT_LIMITS[index + 1] ?? this.LTV_LIMIT)
          );
        },
      ).some((alert: boolean) => alert);

      if (shouldSendNotification) {
        this.amqpConnection.publish(LTV_LIMIT_APPROACHING_EXCHANGE.name, '', {
          userId,
          ltv,
          priceForMarginCall,
          priceForPartialCollateralSale,
          collateralBalance,
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

  public calculateAmountToReachLtv(
    loanedBalance: number,
    collateralBalance: number,
    targetLtv: number,
  ): number {
    const ltv: number = targetLtv / 100;

    return (loanedBalance - ltv * collateralBalance) / (1 - ltv);
  }
}
