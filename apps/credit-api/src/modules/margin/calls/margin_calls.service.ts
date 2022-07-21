import { LiquidatedCollateralAssets, UsersLtv } from '../margin.interfaces';
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
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MarginCallsService {
  CRITICAL_LTV_LIMIT = 85;
  LIQUIDATE_TO_LTV = 60;

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
      ltv: usersLtv.ltv,
      priceForMarginCall: usersLtv.priceForMarginCall,
      priceForPartialCollateralSale: usersLtv.priceForPartialCollateralSale,
      collateralBalance: usersLtv.collateralBalance,
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
      const liquidatedCollateralAssets: LiquidatedCollateralAssets =
        await this.completeMarginCallWithLiquidation(usersLtv, marginCall);

      const loanedBalance: number =
        usersLtv.loanedBalance - liquidatedCollateralAssets.loanRepaymentAmount;

      this.amqpConnection.publish(MARGIN_CALL_COMPLETED_EXCHANGE.name, '', {
        userId: usersLtv.userId,
        liquidation: liquidatedCollateralAssets.liquidatedAssets.map(
          (asset) => ({
            asset: asset.asset,
            amount: asset.amount,
            price: asset.price,
          }),
        ),
        ltv: this.LIQUIDATE_TO_LTV,
        priceForMarginCall:
          this.marginLtvService.calculatePriceForMarginCall(loanedBalance),
        priceForPartialCollateralSale:
          this.marginLtvService.calculatePriceForCollateralSale(loanedBalance),
        collateralBalance:
          usersLtv.collateralBalance -
          liquidatedCollateralAssets.loanRepaymentAmount,
      });
    } else if (alreadyActiveMarginCall === undefined) {
      this.amqpConnection.publish(MARGIN_CALL_STARTED_EXCHANGE.name, '', {
        userId: usersLtv.userId,
        ltv: usersLtv.ltv,
        priceForMarginCall: usersLtv.priceForMarginCall,
        priceForPartialCollateralSale: usersLtv.priceForPartialCollateralSale,
        collateralBalance: usersLtv.collateralBalance,
      });
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
