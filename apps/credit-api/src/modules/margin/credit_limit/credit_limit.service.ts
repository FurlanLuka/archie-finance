import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersLtv } from '../margin.interfaces';
import { GetAssetListResponse } from '@archie-microservices/api-interfaces/asset_information';
import { Credit } from '../../credit/credit.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreditService } from '../../credit/credit.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  CREDIT_LIMIT_DECREASED,
  CREDIT_LIMIT_INCREASED,
} from '@archie/api/credit-api/constants';

@Injectable()
export class CreditLimitService {
  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    private creditService: CreditService,
    private amqpConnection: AmqpConnection,
  ) {}

  public async adjustCreditLimit(
    usersLtv: UsersLtv,
    assetList: GetAssetListResponse,
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
    } else {
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
      .createQueryBuilder('credit')
      .update(Credit)
      .where('userId = :userId', { userId: userId })
      .set({
        totalCredit: () => 'totalCredit + :creditIncrease',
        availableCredit: () => 'availableCredit + :creditIncrease',
      })
      .setParameters({
        creditIncrease: increasedAmount,
      })
      .execute();

    this.amqpConnection.publish(CREDIT_LIMIT_INCREASED.name, '', {
      userId: userId,
      amount: increasedAmount,
    });
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

    const updatedResult: UpdateResult = await this.creditRepository
      .createQueryBuilder('credit')
      .update(Credit)
      .where('userId = :userId AND availableCredit >= :creditDecrease', {
        userId: userId,
        creditDecrease: decreaseAmount,
      })
      .set({
        totalCredit: () => 'totalCredit - :creditDecrease',
        availableCredit: () => 'availableCredit - :creditDecrease',
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

    this.amqpConnection.publish(CREDIT_LIMIT_DECREASED.name, '', {
      userId: userId,
      amount: decreaseAmount,
    });
  }
}
