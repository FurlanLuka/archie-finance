import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { Credit } from './credit.entity';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects/types';
import { DateTime } from 'luxon';
import { CreditPerUser } from './credit.interfaces';
import { GroupingHelper } from '@archie/api/utils/helpers';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(Credit)
    private ltvCreditRepository: Repository<Credit>,
  ) {}

  public async updateCreditBalance(
    credit: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    await this.ltvCreditRepository.manager.update(
      Credit,
      {
        userId: credit.userId,
        calculatedAt: LessThan(credit.calculatedAt),
      },
      {
        utilizationAmount: credit.utilizationAmount,
        calculatedAt: credit.calculatedAt,
      },
    );
  }

  public async getCreditBalance(userId: string): Promise<number> {
    const credit: Credit | null = await this.ltvCreditRepository.findOneBy({
      userId: userId,
    });

    return credit?.utilizationAmount ?? 0;
  }

  public async getCreditBalanceForMultipleUsers(
    userIds: string[],
  ): Promise<CreditPerUser> {
    const credits: Credit[] = await this.ltvCreditRepository.findBy({
      userId: In(userIds),
    });

    return GroupingHelper.mapBy(credits, (credit) => credit.userId);
  }

  public async createCreditBalance(userId: string): Promise<void> {
    await this.ltvCreditRepository.insert({
      userId,
      calculatedAt: DateTime.now().toISO(),
      utilizationAmount: 0,
    });
  }
}
