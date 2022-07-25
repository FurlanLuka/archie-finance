import { Injectable } from '@nestjs/common';
import { UsersLtv } from '../margin.interfaces';
import { MarginCollateralCheck } from '../margin_collateral_check.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MarginCall } from '../margin_calls.entity';

@Injectable()
export class MarginCollateralValueCheckService {
  REQUIRED_COLLATERAL_VALUE_CHANGE_TO_CALCULATE_MARGIN = 10;

  constructor(
    @InjectRepository(MarginCollateralCheck)
    private marginCollateralCheckRepository: Repository<MarginCollateralCheck>,
  ) {}

  public async filterUsersByCollateralValueChange(
    userLtvs: UsersLtv[],
  ): Promise<UsersLtv[]> {
    const marginCollateralChecks: MarginCollateralCheck[] =
      await this.marginCollateralCheckRepository.find({
        where: {
          userId: In(userLtvs.map((userLtv) => userLtv.userId)),
        },
      });

    return userLtvs.filter((usersLtv: UsersLtv) => {
      const marginCollateralCheck: MarginCollateralCheck | null =
        marginCollateralChecks.find(
          (marginCheck) => marginCheck.userId === usersLtv.userId,
        );

      const valueChangeInPercentage: number =
        this.getPercentageDifferenceBetweenValues(
          usersLtv.collateralBalance,
          marginCollateralCheck?.checked_at_collateral_balance ?? 0,
        );

      return (
        valueChangeInPercentage >=
        this.REQUIRED_COLLATERAL_VALUE_CHANGE_TO_CALCULATE_MARGIN
      );
    });
  }

  public async updateMarginChecks(affectedUserLtvs: UsersLtv[]): Promise<void> {
    const executedMarginCollateralChecks = affectedUserLtvs.map(
      (usersLtv: UsersLtv): Partial<MarginCollateralCheck> => ({
        checked_at_collateral_balance: usersLtv.collateralBalance,
        userId: usersLtv.userId,
      }),
    );
    await this.marginCollateralCheckRepository.upsert(
      executedMarginCollateralChecks,
      {
        conflictPaths: ['userId'],
      },
    );
  }

  private getPercentageDifferenceBetweenValues(
    newValue: number,
    previousValue: number,
  ): number {
    return (
      (Math.abs(newValue - previousValue) / ((newValue + previousValue) / 2)) *
      100
    );
  }
}
