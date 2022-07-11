import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credit } from '../credit/credit.entity';
import { In, Repository } from 'typeorm';
import { InternalApiService } from '@archie-microservices/internal-api';
import {
  CollateralValue,
  GetCollateralValueResponse,
} from '@archie-microservices/api-interfaces/collateral';
import { LiquidationLogs } from './liquidation_logs.entity';
import { MarginCalls } from './margin_calls.entity';
import { MarginNotifications } from './margin_notifications.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { DateTime, Interval } from 'luxon';

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
    private amqpConnection: AmqpConnection,
  ) {}

  public async checkMargin(userIds: string[]): Promise<void> {
    // TODO: Get starting value & calculate if value changed by 10%
    // TODO: adjust the credit limit (in any case if It goes up or down)
    console.log(userIds);
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

    await Promise.all(
      userIds.map(async (userId: string) => {
        const usersCollateral: GetCollateralValueResponse =
          await this.internalApiService.getUserCollateralValue(userId);
        // TODO: move collateral api to credit api

        const totalCollateralValue: number = usersCollateral.reduce(
          (collateralPrice: number, collateralValue: CollateralValue) =>
            collateralPrice + collateralValue.price,
          0,
        );

        const usersCredit: Credit = credits.find(
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

        const userSpent: number =
          usersCredit.totalCredit - usersCredit.availableCredit;
        const userOwes: number = userSpent - usersLiquidationLogsSum;
        const ltv: number = (userOwes / totalCollateralValue) * 100;

        await this.sendNotification(userId, ltv);

        const alreadyActiveMarginCall: MarginCalls | undefined =
          activeMarginCalls.find((marginCall) => marginCall.userId === userId);

        if (ltv < 75) {
          if (alreadyActiveMarginCall !== undefined) {
            await this.marginCallsRepository.softDelete({
              userId: userId,
            });
            this.amqpConnection.publish(
              MARGIN_CALL_COMPLETED_EXCHANGE.name,
              '',
              {
                userId,
                liquidation: [],
              },
            );
            // TODO: Reactivate card - EVENT handled by rize
            // TODO: send email that margin is now ok, 72 hour limit ok
            this.amqpConnection.publish('EMAIL_SENDING_REQUESTED', '', {
              userId,
              template_id: 6,
              ltv: ltv,
            });
          }
        } else {
          const marginCall: MarginCalls =
            alreadyActiveMarginCall ??
            (await this.marginCallsRepository.save({
              userId: userId,
            }));

          const timePassedInHours: number = Interval.fromDateTimes(
            marginCall.createdAt,
            DateTime.utc(),
          ).length('hours');

          if (ltv >= 85 || timePassedInHours >= 72) {
            const toPayArchieCollateralAmount: number =
              this.amountToTakeToReach60Ltv(userOwes, totalCollateralValue);

            if (ltv < 85) {
              this.amqpConnection.publish('EMAIL_SENDING_REQUESTED', '', {
                userId,
                template_id: 4,
                ltv: ltv,
                //TODO: Add email content - 72h passed, crypto taken
              });
            }

            await this.transitionCryptoToArchieVault(
              userId,
              toPayArchieCollateralAmount,
              usersCollateral,
              marginCall,
            );
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
                skipUpdateIfNoValuesChanged: true,
              },
            );
          } else if (alreadyActiveMarginCall === undefined) {
            this.amqpConnection.publish(MARGIN_CALL_STARTED_EXCHANGE.name, '', {
              userId,
            });
            // TODO: deactivate card - EVENT handled by rize
          }
        }
      }),
    );
  }

  private async transitionCryptoToArchieVault(
    userId: string,
    amount: number,
    collateralAssets: GetCollateralValueResponse,
    marginCall: MarginCalls,
  ): Promise<void> {
    const sortedCollateralAssetsByAllocation: GetCollateralValueResponse =
      collateralAssets
        .slice()
        .sort((a: CollateralValue, b: CollateralValue) =>
          a.price >= b.price ? -1 : 1,
        );

    let targetAmount: number = amount;

    const liquidatedCollateralAssets: Partial<LiquidationLogs>[] =
      sortedCollateralAssetsByAllocation
        .map((collateralValue): Partial<LiquidationLogs> => {
          if (targetAmount > 0) {
            let newPrice: number = collateralValue.price - targetAmount;

            if (newPrice >= 0) {
              targetAmount -= collateralValue.price - newPrice;
            } else {
              newPrice = 0;
              targetAmount -= collateralValue.price;
            }

            const assetAmountPerUnit: number =
              collateralValue.price / collateralValue.assetAmount;
            const newAssetAmount: number = newPrice / assetAmountPerUnit;

            return {
              asset: collateralValue.asset,
              amount: collateralValue.assetAmount - newAssetAmount,
              userId,
              marginCall: marginCall,
              price: collateralValue.price - newPrice,
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

    // TODO: transition assets to Archie using fireblocks (collateral service) - vault EVENT
    // TODO: send email
    this.amqpConnection.publish(MARGIN_CALL_COMPLETED_EXCHANGE.name, '', {
      userId,
      liquidation: liquidatedCollateralAssets.map((liquidatedAssets) => ({
        asset: liquidatedAssets.asset,
        amount: liquidatedAssets.amount,
        price: liquidatedAssets.price,
      })),
    });
    // TODO: update collateral amount once collateral entity is moved
    await this.liquidationLogsRepository.save(liquidatedCollateralAssets);
  }

  private async sendNotification(userId: string, ltv: number) {
    console.log(ltv);

    if (ltv >= 65) {
      const marginNotifications: MarginNotifications | null =
        await this.marginNotificationsRepository.findOne({
          where: {
            userId,
          },
        });

      if (
        (marginNotifications === null ||
          marginNotifications.active === false) &&
        ltv < 70
      ) {
        this.amqpConnection.publish('EMAIL_SENDING_REQUESTED', '', {
          userId,
          template_id: 1,
          ltv: ltv,
          //TODO: Add email content
        });

        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: true,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['userId'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      } else if (
        (marginNotifications === null ||
          marginNotifications.active === false ||
          marginNotifications.sentAtLtv < 70) &&
        ltv >= 70 &&
        ltv < 73
      ) {
        this.amqpConnection.publish('EMAIL_SENDING_REQUESTED', '', {
          userId,
          template_id: 1,
          ltv: ltv,
          //TODO: Add email content
        });
        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: true,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['userId'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      } else if (
        (marginNotifications === null ||
          marginNotifications.active === false ||
          marginNotifications.sentAtLtv < 73) &&
        ltv >= 73 &&
        ltv < 75
      ) {
        this.amqpConnection.publish('EMAIL_SENDING_REQUESTED', '', {
          userId,
          template_id: 1,
          ltv: ltv,
          //TODO: Add email content
        });
        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: true,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['userId'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      } else if (
        (marginNotifications === null ||
          marginNotifications.active === false ||
          marginNotifications.sentAtLtv < 75) &&
        ltv >= 75 &&
        ltv < 85
      ) {
        // TODO: use sendgrid and send different email (72h mail)
        this.amqpConnection.publish('EMAIL_SENDING_REQUESTED', '', {
          userId,
          template_id: 2,
          ltv: ltv,
          //TODO: Add email content
        });
        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: true,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['userId'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      } else if (
        (marginNotifications === null ||
          marginNotifications.active === false ||
          marginNotifications.sentAtLtv < 85) &&
        ltv >= 85
      ) {
        // TODO: use sendgrid and send different email (crypto taken mail)
        this.amqpConnection.publish('EMAIL_SENDING_REQUESTED', '', {
          userId,
          template_id: 3,
          ltv: ltv,
          //TODO: Add email content
        });
        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: false,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['userId'],
            skipUpdateIfNoValuesChanged: true,
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

  private amountToTakeToReach60Ltv(userOwes: number, usersCollateral) {
    return (userOwes - 0.6 * usersCollateral) / 0.4;
  }
}
