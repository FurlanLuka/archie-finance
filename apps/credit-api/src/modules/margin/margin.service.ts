import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credit } from '../credit/credit.entity';
import { In, Repository } from 'typeorm';
import { LiquidationLog } from './liquidation_logs.entity';
import { MarginCall } from './margin_calls.entity';
import { UsersLtv } from './margin.interfaces';
import { MarginLtvService } from './ltv/margin_ltv.service';
import { MarginCallsService } from './calls/margin_calls.service';
import { Collateral } from '../collateral/collateral.entity';
import { InternalApiService } from '@archie-microservices/internal-api';
import { GetAssetPricesResponse } from '@archie-microservices/api-interfaces/asset_price';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MARGIN_CHECK_REQUESTED_EXCHANGE } from '@archie/api/credit-api/constants';

@Injectable()
export class MarginService {
  LTV_LIMIT = 75;
  QUEUE_EVENTS_LIMIT = 10000;

  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    @InjectRepository(LiquidationLog)
    private liquidationLogsRepository: Repository<LiquidationLog>,
    @InjectRepository(MarginCall)
    private marginCallsRepository: Repository<MarginCall>,
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    private marginLtvService: MarginLtvService,
    private marginCallsService: MarginCallsService,
    private internalApiService: InternalApiService,
    private amqpConnection: AmqpConnection,
  ) {}

  public async triggerMarginCheck(): Promise<void> {
    const credits: Credit[] = await this.creditRepository
      .createQueryBuilder('credit')
      .select('DISTINCT credit.userId')
      .getRawMany();
    const userIds: string[] = credits.map((credit) => credit.userId);

    const chunkSize: number = Math.ceil(
      userIds.length / this.QUEUE_EVENTS_LIMIT,
    );

    for (let i = 0; i < userIds.length; i += chunkSize) {
      const chunk: string[] = userIds.slice(i, i + chunkSize);

      this.amqpConnection.publish(MARGIN_CHECK_REQUESTED_EXCHANGE.name, '', {
        userIds: chunk,
      });
    }
  }

  public async checkMargin(userIds: string[]): Promise<void> {
    const credits: Credit[] = await this.creditRepository.find({
      where: {
        userId: In(userIds),
      },
    });
    const activeMarginCalls: MarginCall[] =
      await this.marginCallsRepository.find({
        where: {
          userId: In(userIds),
        },
      });
    const liquidationLogs: LiquidationLog[] =
      await this.liquidationLogsRepository.find({
        where: {
          userId: In(userIds),
        },
      });
    const collaterals: Collateral[] = await this.collateralRepository.find({
      where: {
        userId: In(userIds),
      },
    });
    const assetPrices: GetAssetPricesResponse =
      await this.internalApiService.getAssetPrices();

    const userLtvs: UsersLtv[] = userIds.map((userId: string) =>
      this.marginLtvService.calculateUsersLtv(
        userId,
        credits,
        liquidationLogs,
        collaterals,
        assetPrices,
      ),
    );

    await Promise.all(
      userLtvs.map(async (usersLtv: UsersLtv) => {
        const alreadyActiveMarginCall: MarginCall | undefined =
          activeMarginCalls.find(
            (marginCall) => marginCall.userId === usersLtv.userId,
          );

        if (usersLtv.ltv < this.LTV_LIMIT) {
          if (alreadyActiveMarginCall !== undefined) {
            await this.marginCallsService.completeMarginCallWithoutLiquidation(
              usersLtv,
            );
          } else {
            await this.marginLtvService.checkIfApproachingLtvLimits(
              usersLtv.userId,
              usersLtv.ltv,
            );
          }
        } else {
          await this.marginCallsService.handleMarginCall(
            alreadyActiveMarginCall,
            usersLtv,
          );
        }
      }),
    );
  }
}