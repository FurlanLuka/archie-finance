import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersLtv } from '../margin.interfaces';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CREDIT_LIMIT_DECREASED_TOPIC,
  CREDIT_LIMIT_INCREASED_TOPIC,
} from '@archie/api/credit-api/constants';
import { Credit, CreditService } from '@archie/api/credit-api/credit';
import { QueueService } from '@archie/api/utils/queue';
import { AssetList } from '@archie/api/collateral-api/asset-information';
import {
  CreditLimitDecreasedPayload,
  CreditLimitIncreasedPayload,
} from '@archie/api/credit-api/margin';

@Injectable()
export class CreditLimitService {
  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    private creditService: CreditService,
    private queueService: QueueService,
  ) {}

  public async adjustCreditLimit(
    usersLtv: UsersLtv,
    assetList: AssetList,
    credits: Credit[],
  ) {
    const creditLimit: number = this.creditService.getCreditLimit(
      usersLtv.collateralAllocation,
      assetList,
    );
    const credit: Credit = credits.find(
      (credit: Credit) => credit.userId === usersLtv.userId,
    );

    if (creditLimit > credit.totalCredit) {
      await this.increaseCreditLimit(credit, creditLimit, usersLtv.userId);
    } else if (creditLimit < credit.totalCredit) {
      await this.decreaseCreditLimit(credit, creditLimit, usersLtv.userId);
    }
  }

  private async increaseCreditLimit(
    credit: Credit,
    creditLimit: number,
    userId: string,
  ): Promise<void> {
    const increasedAmount: number = creditLimit - credit.totalCredit;

    await this.creditRepository
      .createQueryBuilder('Credit')
      .update(Credit)
      .where('userId = :userId', { userId: userId })
      .set({
        totalCredit: () => '"totalCredit" + :creditIncrease',
        availableCredit: () => '"availableCredit" + :creditIncrease',
      })
      .setParameter('creditIncrease', increasedAmount)
      .execute();

    this.queueService.publish<CreditLimitIncreasedPayload>(
      CREDIT_LIMIT_INCREASED_TOPIC,
      {
        userId: userId,
        amount: increasedAmount,
      },
    );
  }

  private async decreaseCreditLimit(
    credit: Credit,
    creditLimit: number,
    userId: string,
  ): Promise<void> {
    const creditLimitDecrease: number = credit.totalCredit - creditLimit;
    const decreaseAmount: number =
      creditLimitDecrease < credit.availableCredit
        ? creditLimitDecrease
        : credit.availableCredit;

    if (decreaseAmount > 0) {
      const updatedResult: UpdateResult = await this.creditRepository
        .createQueryBuilder('Credit')
        .update(Credit)
        .where('userId = :userId AND availableCredit >= :creditDecrease', {
          userId: userId,
          creditDecrease: decreaseAmount,
        })
        .set({
          totalCredit: () => '"totalCredit" - :creditDecrease',
          availableCredit: () => '"availableCredit" - :creditDecrease',
        })
        .setParameters({
          creditDecrease: decreaseAmount,
        })
        .execute();

      if (updatedResult.affected === 0) {
        throw new InternalServerErrorException({
          error: 'Credit line could not be decreased',
          userId: userId,
          decreaseAmount: decreaseAmount,
        });
      }

      this.queueService.publish<CreditLimitDecreasedPayload>(
        CREDIT_LIMIT_DECREASED_TOPIC,
        {
          userId: userId,
          amount: decreaseAmount,
        },
      );
    }
  }
}
