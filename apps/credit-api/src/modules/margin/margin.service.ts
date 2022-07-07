import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credit } from '../credit/credit.entity';
import { In, Repository } from 'typeorm';
import { InternalApiService } from '@archie-microservices/internal-api';
import { GetAssetPricesResponse } from '@archie-microservices/api-interfaces/asset_price';
import {
  CollateralValue,
  GetCollateralValueResponse,
} from '@archie-microservices/api-interfaces/collateral';
import { LiquidationLogs } from './liquidation_logs.entity';
import { MarginCalls } from './margin_calls.entity';
import { MarginNotifications } from './margin_notifications.entity';
import { MarginController } from './margin.controller';

@Injectable()
export class MarginService {
  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    @InjectRepository(LiquidationLogs)
    private liquidationLogsRepository: Repository<LiquidationLogs>,
    @InjectRepository(MarginCalls)
    private marginCallsRepository: Repository<MarginCalls>,
    @InjectRepository(MarginNotifications)
    private marginNotificationsRepository: Repository<MarginNotifications>,
    private internalApiService: InternalApiService,
  ) {}

  public async checkMargin(): Promise<void> {
    // move to queue which will accept batch of users to check
    const userIds: string[] = ['auth0|'];
    // load Current asset prices
    const assetPrices: GetAssetPricesResponse =
      await this.internalApiService.getAssetPrices();

    // load users credit - total & available
    const credits: Credit[] = await this.creditRepository.find({
      where: {
        userId: In(userIds),
      },
    });

    const userId: string = userIds[0];
    // load users collateral/(api call to load collateral from all users - event driven??)
    // event driven: 1. asset price updated 2. collateral service calculates & publishes collateral price changed 3. margin service calculates
    const usersCollateral: GetCollateralValueResponse =
      await this.internalApiService.getUserCollateralValue(userId);

    // Calculate LTV (available / total collateral value)
    const totalCollateralValue: number = usersCollateral.reduce(
      (collateralPrice: number, collateralValue: CollateralValue) =>
        collateralPrice + collateralValue.price,
      0,
    );
    const usersCredit: Credit = credits.find(
      (credit: Credit) => credit.userId === userId,
    );

    const ltv: number = (usersCredit.totalCredit / totalCollateralValue) * 100;
    // if ltv > x send email < 85
    await this.sendNotification(userId, ltv);

    if (ltv > 75) {
      const marginCall: MarginCalls | null =
        await this.marginCallsRepository.findOne({
          where: {
            userId: userId,
          },
        });

      const timePassed: number =
        marginCall !== null
          ? (new Date().getTime() - new Date(marginCall.createdAt).getTime()) /
            36000
          : 0;

      // if ltv > 85 then transition collateral to a different vault or 3 days passed since ltv reached 75% - reset if goes under
      if (ltv > 85 || timePassed >= 72) {
        // liquidate - try to lower credit else transition crypto to archie vault
        // calculate how much credit we must take to be ok
        // if value > available - take everything + required crypto
        // which asset to select???
        // add log to liquidation_logs table
        const availableLoanToSatisfyLtv: number = totalCollateralValue * 0.6;

        // the amount you have - amount you can have = amount to pay
        const toPayArchieDollars: number =
          usersCredit.totalCredit - availableLoanToSatisfyLtv;

        if (usersCredit.availableCredit >= availableLoanToSatisfyLtv) {
          // TODO change in credit entity (substract) - be aware of race conditions if something is spent
        } else {
          // TODO: pay what you can from credit, rest from crypto
          // TODO: how to determine which asset
        }

        await this.marginCallsRepository.softDelete({
          userId: userId,
        });
      }
    } else {
      await this.marginCallsRepository.softDelete({
        userId: userId,
      });
    }
  }

  private async sendNotification(userId: string, ltv: number) {
    // send if minimum 65%, 70, 73
    if (ltv > 65) {
      const marginNotifications: MarginNotifications | null =
        await this.marginNotificationsRepository.findOne({
          where: {
            userId,
          },
        });

      if (
        marginNotifications === null ||
        marginNotifications.active === false
      ) {
        // TODO: use sendgrid
        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: true,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['user_id'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      } else if (marginNotifications.sentAtLtv < 70 && ltv >= 70) {
        // TODO: use sendgrid
        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: true,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['user_id'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      } else if (marginNotifications.sentAtLtv < 73 && ltv >= 73) {
        // TODO: use sendgrid
        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: true,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['user_id'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      }
    } else {
      // TODO: should we send notification if It fails under 65?
      await this.marginNotificationsRepository.upsert(
        {
          userId: userId,
          active: false,
          sentAtLtv: null,
        },
        {
          conflictPaths: ['user_id'],
          skipUpdateIfNoValuesChanged: true,
        },
      );
    }
  }
}
