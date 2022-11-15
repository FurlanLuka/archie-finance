import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository, UpdateResult } from 'typeorm';
import { Credit } from './credit.entity';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects/types';
import { DateTime } from 'luxon';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(Credit)
    private ltvCreditRepository: Repository<Credit>,
  ) {}

  public async updateCreditBalance(
    credit: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    const existingCreditLine: Credit | null =
      await this.ltvCreditRepository.findOneBy({
        userId: credit?.userId,
      });

    if (existingCreditLine === null)
      throw new Error('CREDIT_LINE_NOT_CREATED_YET_RETRY');

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

  public async createCreditBalance(
    userId: string,
    calculatedAt: string,
  ): Promise<void> {
    await this.ltvCreditRepository.insert({
      userId,
      calculatedAt: calculatedAt,
      utilizationAmount: 0,
    });
  }
}
