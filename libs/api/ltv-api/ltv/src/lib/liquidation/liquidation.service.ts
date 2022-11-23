import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Liquidation } from './liquidation.entity';
import { In, Repository } from 'typeorm';
import { LiquidationsPerUser } from './liquidation.interfaces';
import { GroupingHelper } from '@archie/api/utils/helpers';
import { LtvMeta } from '../margin/margin.interfaces';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class LiquidationService {
  constructor(
    @InjectRepository(Liquidation)
    private liquidationRepository: Repository<Liquidation>,
  ) {}

  public async createLiquidation(
    marginCallUuid: string,
    amount: number,
  ): Promise<Liquidation> {
    return this.liquidationRepository.save({
      marginCall: {
        uuid: marginCallUuid,
      },
      amount,
    });
  }

  public async getLiquidations(
    userIds: string[],
  ): Promise<LiquidationsPerUser> {
    const liquidations: Liquidation[] = await this.liquidationRepository.find({
      where: {
        marginCall: {
          userId: In(userIds),
        },
      },
      relations: {
        marginCall: true,
      },
    });

    return GroupingHelper.groupBy(
      liquidations,
      (liquidation) => liquidation.marginCall.userId,
    );
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
        isCreditUtilizationUpdated: true,
      },
    );
  }

  public async reducePendingLiquidationAmountWithLookup(
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

    return this.reducePendingLiquidationAmount(
      userId,
      creditUtilization,
      ledgerValue,
      liquidations,
    );
  }

  public reducePendingLiquidationAmount(
    userId: string,
    creditUtilization: number,
    ledgerValue: number,
    liquidations: Liquidation[],
  ): LtvMeta {
    const pendingLiquidatedCreditUtilization = liquidations.reduce(
      (pendingValue, liquidation) => {
        return !liquidation.isCreditUtilizationUpdated
          ? BigNumber(pendingValue).plus(liquidation.amount)
          : pendingValue;
      },
      '0',
    );
    const pendingLiquidatedLedgerValue = liquidations.reduce(
      (pendingValue, liquidation) => {
        return !liquidation.isLedgerValueUpdated
          ? BigNumber(pendingValue).plus(liquidation.amount)
          : pendingValue;
      },
      '0',
    );

    return {
      creditUtilization: BigNumber(creditUtilization)
        .minus(pendingLiquidatedCreditUtilization)
        .toNumber(),
      ledgerValue: BigNumber(ledgerValue)
        .minus(pendingLiquidatedLedgerValue)
        .toNumber(),
    };
  }
}
