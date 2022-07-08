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
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
} from '@archie/api/credit-api/constants';

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
    // move to queue which will accept batch of users to check
    // load Current asset prices -- we need starting number
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

        const userSpent: number =
          usersCredit.totalCredit - usersCredit.availableCredit;
        const ltv: number = (userSpent / totalCollateralValue) * 100;

        await this.sendNotification(userId, ltv);

        const alreadyActiveMarginCall: MarginCalls | null =
          activeMarginCalls.find((marginCall) => marginCall.userId === userId);

        if (ltv < 75) {
          if (alreadyActiveMarginCall !== null) {
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
          }
        } else {
          const marginCall =
            alreadyActiveMarginCall ??
            (await this.marginCallsRepository.save({
              userId: userId,
            }));

          const timePassedInHours: number =
            (new Date().getTime() - new Date(marginCall.createdAt).getTime()) /
            36000;

          // if ltv > 85 then transition collateral to a different vault or 3 days passed since ltv reached 75% - reset if goes under
          if (ltv >= 85 || timePassedInHours >= 72) {
            // liquidate - try to lower credit limit , transition crypto to archie vault

            // calculate how much credit we must take to be ok

            const availableLoanToSatisfyLtv: number =
              totalCollateralValue * 0.6;

            // the amount spent - amount you can have = amount to pay
            const toPayArchieCollateralAmount: number =
              userSpent - availableLoanToSatisfyLtv;

            await this.transitionCryptoToArchieVault(
              userId,
              toPayArchieCollateralAmount,
              usersCollateral,
              marginCall,
            );
            await this.marginCallsRepository.softDelete({
              userId: userId,
            });
            // TODO: Reactivate card - EVENT handled by rize
            this.amqpConnection.publish(
              MARGIN_CALL_COMPLETED_EXCHANGE.name,
              '',
              {
                userId,
              },
            );
          } else if (alreadyActiveMarginCall === null) {
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
    // which asset to select? - Order by the allocation (asset value)
    const sortedCollateralAssets = collateralAssets
      .slice()
      .sort((a: CollateralValue, b: CollateralValue) =>
        a.price >= b.price ? -1 : 1,
      );

    let targetAmount: number = amount;

    const liquidatedCollateralAssets: Partial<LiquidationLogs>[] =
      sortedCollateralAssets
        .map((collateralValue): Partial<LiquidationLogs> => {
          if (targetAmount > 0) {
            let newPrice: number = collateralValue.price - amount;

            if (newPrice >= 0) {
              targetAmount = targetAmount - (collateralValue.price - newPrice);
            } else {
              newPrice = 0;
              targetAmount = targetAmount - collateralValue.price;
            }

            const assetAmountPerUnit: number =
              collateralValue.price / collateralValue.assetAmount;
            const newAssetAmount: number = newPrice / assetAmountPerUnit;

            return {
              asset: collateralValue.asset,
              amount: collateralValue.assetAmount - newAssetAmount,
              userId,
              marginCall: marginCall,
            };
          }

          return {
            asset: collateralValue.asset,
            amount: 0,
            userId,
            marginCall: marginCall,
          };
        })
        .filter((liquidatedAsset) => liquidatedAsset.amount > 0);

    // TODO: transition assets to Archie using fireblocks (collateral service) - vault EVENT
    this.amqpConnection.publish(MARGIN_CALL_COMPLETED_EXCHANGE.name, '', {
      userId,
      liquidation: [
        liquidatedCollateralAssets.map((liquidatedAssets) => ({
          asset: liquidatedAssets.asset,
          amount: liquidatedAssets.amount,
        })),
      ],
    });

    await this.liquidationLogsRepository.save(liquidatedCollateralAssets);
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
      } else if (marginNotifications.sentAtLtv < 75 && ltv >= 75) {
        // TODO: use sendgrid and send different email (72h mail)
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
      } else if (marginNotifications.sentAtLtv < 85 && ltv >= 85) {
        // TODO: use sendgrid and send different email (crypto taken mail)
        await this.marginNotificationsRepository.upsert(
          {
            userId: userId,
            active: false,
            sentAtLtv: ltv,
          },
          {
            conflictPaths: ['user_id'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      }
    } else {
      // reset notifications
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
