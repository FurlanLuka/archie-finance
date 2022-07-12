import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credit } from '../credit/credit.entity';
import { In, Repository } from 'typeorm';
import { LiquidationLog } from './liquidation_logs.entity';
import { MarginCall } from './margin_calls.entity';
import { MarginNotification } from './margin_notifications.entity';
import { InternalApiService } from '@archie-microservices/internal-api';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UsersLtv } from './margin.interfaces';
import { MarginLtvService } from './ltv/margin_ltv.service';
import { MarginCallsService } from './calls/margin_calls.service';

@Injectable()
export class MarginService {
  LTV_LIMIT = 75;

  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    @InjectRepository(LiquidationLog)
    private liquidationLogsRepository: Repository<LiquidationLog>,
    @InjectRepository(MarginCall)
    private marginCallsRepository: Repository<MarginCall>,
    private marginLtvService: MarginLtvService,
    private marginCallsService: MarginCallsService,
  ) {}

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

    const userLtvs: UsersLtv[] = await Promise.all(
      userIds.map(async (userId: string) =>
        this.marginLtvService.calculateUsersLtv(
          userId,
          credits,
          liquidationLogs,
        ),
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
