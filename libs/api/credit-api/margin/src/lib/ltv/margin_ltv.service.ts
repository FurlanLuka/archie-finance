import { LiquidationLog } from '../liquidation_logs.entity';
import { LtvStatus, UsersLtv } from '../margin.interfaces';
import { CollateralValue } from '@archie/api/utils/interfaces/collateral';
import { Injectable } from '@nestjs/common';
import { MarginNotification } from '../margin_notifications.entity';
import { LTV_LIMIT_APPROACHING_EXCHANGE } from '@archie/api/credit-api/constants';
import { Repository } from 'typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAssetPricesResponse } from '@archie/api/utils/interfaces/asset_price';
import {
  Collateral,
  CollateralValueService,
} from '@archie/api/credit-api/collateral';
import { Credit } from '@archie/api/credit-api/credit';

@Injectable()
export class MarginLtvService {
  LTV_OK_LIMIT = 50;
  LTV_WARNING_LIMIT = 65;
  LTV_ALERT_LIMITS = [this.LTV_WARNING_LIMIT, 70, 73];
  LTV_MARGIN_CALL_LIMIT = 75;
  COLLATERAL_SALE_LTV_LIMIT = 85;

  constructor(
    @InjectRepository(MarginNotification)
    private marginNotificationsRepository: Repository<MarginNotification>,
    private amqpConnection: AmqpConnection,
    private collateralValueService: CollateralValueService,
  ) {}

  public getLtvStatus(ltv: UsersLtv): LtvStatus {
    if (ltv.ltv < this.LTV_OK_LIMIT) return LtvStatus.good;
    else if (ltv.ltv < this.LTV_WARNING_LIMIT) return LtvStatus.ok;
    else if (ltv.ltv < this.LTV_MARGIN_CALL_LIMIT) return LtvStatus.warning;
    else return LtvStatus.margin_call;
  }

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
      priceForMarginCall: this.calculatePriceForMarginCall(loanedBalance),
      priceForPartialCollateralSale:
        this.calculatePriceForCollateralSale(loanedBalance),
    };
  }

  public calculatePriceForMarginCall(loanedBalance: number): number {
    return loanedBalance / (this.LTV_MARGIN_CALL_LIMIT / 100);
  }

  public calculatePriceForCollateralSale(loanedBalance: number): number {
    return loanedBalance / (this.COLLATERAL_SALE_LTV_LIMIT / 100);
  }

  public async checkIfApproachingLtvLimits(usersLtv: UsersLtv) {
    const {
      ltv,
      userId,
      priceForMarginCall,
      priceForPartialCollateralSale,
      collateralBalance,
    } = usersLtv;

    if (ltv >= this.LTV_ALERT_LIMITS[0]) {
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
            ltv <
              (this.LTV_ALERT_LIMITS[index + 1] ?? this.LTV_MARGIN_CALL_LIMIT)
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
