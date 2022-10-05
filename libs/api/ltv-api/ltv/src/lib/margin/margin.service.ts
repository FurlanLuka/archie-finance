import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarginCall } from './margin_calls.entity';
import { MarginCheck } from './margin_check.entity';
import { MathUtilService } from './utils/math.service';
import { MarginActionsCheckUtilService } from './utils/margin_actions_check.service';
import { MarginAction } from './utils/utils.interfaces';
import { MarginActionHandlersUtilService } from './utils/margin_action_handlers.service';
import { MarginNotification } from './margin_notifications.entity';
import { LtvMeta } from './margin.interfaces';
import { Liquidation } from './liquidation.entity';

@Injectable()
export class MarginService {
  constructor(
    @InjectRepository(MarginCall)
    private marginCallsRepository: Repository<MarginCall>,
    @InjectRepository(MarginCheck)
    private marginCheckRepository: Repository<MarginCheck>,
    @InjectRepository(MarginNotification)
    private marginNotificationRepository: Repository<MarginNotification>,
    @InjectRepository(Liquidation)
    private liquidationRepository: Repository<Liquidation>,
    private mathUtilService: MathUtilService,
    private marginCheckUtilService: MarginActionsCheckUtilService,
    private marginActionHandlersUtilService: MarginActionHandlersUtilService,
  ) {}

  public async reducePendingLiquidationAmount(
    userId: string,
    creditUtilization: number,
    ledgerValue: number,
  ): Promise<LtvMeta> {
    const liquidations: Liquidation[] = await this.liquidationRepository.find({
      where: {
        marginCall: {
          userId,
        },
      },
      relations: {
        marginCall: true,
      },
    });

    const pendingLiquidatedCreditUtilization = liquidations.reduce(
      (pendingValue, liquidation) => {
        return !liquidation.isCreditBalanceUpdated
          ? pendingValue - liquidation.amount
          : pendingValue;
      },
      0,
    );
    const pendingLiquidatedLedgerValue = liquidations.reduce(
      (pendingValue, liquidation) => {
        return !liquidation.isLedgerValueUpdated
          ? pendingValue - liquidation.amount
          : pendingValue;
      },
      0,
    );

    return {
      creditUtilization: creditUtilization - pendingLiquidatedCreditUtilization,
      ledgerValue: ledgerValue - pendingLiquidatedLedgerValue,
    };
  }

  public async acknowledgeLiquidationCollateralBalanceUpdate(
    liquidationId: string,
  ): Promise<void> {
    await this.liquidationRepository.update(
      {
        id: liquidationId,
      },
      {
        isLedgerValueUpdated: true,
      },
    );
  }

  public async acknowledgeLiquidationCreditBalanceUpdate(
    liquidationId: string,
  ): Promise<void> {
    await this.liquidationRepository.update(
      {
        id: liquidationId,
      },
      {
        isCreditBalanceUpdated: true,
      },
    );
  }

  public async executeMarginCallCheck(
    userId: string,
    ltv: number,
    ltvMeta: LtvMeta,
  ): Promise<void> {
    const activeMarginCall: MarginCall | null =
      await this.marginCallsRepository.findOne({
        where: {
          userId,
        },
        relations: {
          liquidation: true,
        },
      });
    const lastMarginCheck: MarginCheck | null =
      await this.marginCheckRepository.findOneBy({
        userId,
      });
    const marginNotification: MarginNotification | null =
      await this.marginNotificationRepository.findOneBy({
        userId,
      });

    const actions: MarginAction[] = this.marginCheckUtilService.getActions(
      activeMarginCall,
      lastMarginCheck,
      marginNotification,
      ltv,
      ltvMeta.ledgerValue,
    );

    if (actions.length > 0) {
      await this.upsertMarginCheck(userId, ltv, ltvMeta.ledgerValue);

      await this.marginActionHandlersUtilService.handle(actions, {
        userId,
        ltv,
        ltvMeta,
      });
    }
  }

  private async upsertMarginCheck(
    userId: string,
    ltv: number,
    ledgerValue: number,
  ): Promise<void> {
    await this.marginCheckRepository.upsert(
      {
        userId,
        ltv,
        ledgerValue: ledgerValue,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }
}
