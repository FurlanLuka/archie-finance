import { UsersLtv } from '../margin.interfaces';
import { Injectable } from '@nestjs/common';
import {
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { Repository } from 'typeorm';
import { MarginCall } from '../margin_calls.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { DateTime, Interval } from 'luxon';
import { MarginLtvService } from '../ltv/margin_ltv.service';
import { MarginLiquidationService } from './liquidation/margin_liquidation.service';
import { MarginNotification } from '../margin_notifications.entity';
import { LiquidationLog } from '../liquidation_logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAssetPricesResponse } from '@archie-microservices/api-interfaces/asset_price';

@Injectable()
export class MarginCallsService {
  CRITICAL_LTV_LIMIT = 85;

  constructor(
    @InjectRepository(MarginNotification)
    private marginNotificationsRepository: Repository<MarginNotification>,
    @InjectRepository(MarginCall)
    private marginCallsRepository: Repository<MarginCall>,
    private amqpConnection: AmqpConnection,
    private marginLtvService: MarginLtvService,
    private marginLiquidationService: MarginLiquidationService,
  ) {}

  public async completeMarginCallWithoutLiquidation(usersLtv: UsersLtv) {
    await this.marginCallsRepository.softDelete({
      userId: usersLtv.userId,
    });
    this.amqpConnection.publish(MARGIN_CALL_COMPLETED_EXCHANGE.name, '', {
      userId: usersLtv.userId,
      liquidation: [],
    });
  }

  public async handleMarginCall(
    alreadyActiveMarginCall: MarginCall,
    usersLtv: UsersLtv,
  ) {
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
      hoursPassedSinceTheStartOfMarginCall >= 72 ||
      usersLtv.ltv >= this.CRITICAL_LTV_LIMIT
    ) {
      const assetsToLiquidate: Partial<LiquidationLog>[] =
        await this.completeMarginCallWithLiquidation(usersLtv, marginCall);

      this.amqpConnection.publish(MARGIN_CALL_COMPLETED_EXCHANGE.name, '', {
        userId: usersLtv.userId,
        liquidation: assetsToLiquidate.map((asset) => ({
          asset: asset.asset,
          amount: asset.amount,
          price: asset.price,
        })),
      });
    } else if (alreadyActiveMarginCall === undefined) {
      this.amqpConnection.publish(MARGIN_CALL_STARTED_EXCHANGE.name, '', {
        userId: usersLtv.userId,
      });
    }
  }

  private async completeMarginCallWithLiquidation(
    usersLtv: UsersLtv,
    marginCall: MarginCall,
  ): Promise<Partial<LiquidationLog>[]> {
    const loanRepaymentAmount: number =
      this.marginLtvService.calculateAmountToReachSafeLtv(
        usersLtv.loanedBalance,
        usersLtv.collateralBalance,
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

    return assetsToLiquidate;
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
