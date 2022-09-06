import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { LtvCredit } from '../credit.entity';
import {
  CreditBalanceUpdatedPayload,
  PaymentType,
} from '@archie/api/peach-api/data-transfer-objects';
import { LtvCollateral } from '../collateral.entity';
import { CreditLineCreatedPayload } from '@archie/api/credit-limit-api/data-transfer-objects';
import { DateTime } from 'luxon';
import { LtvUpdatedUtilService } from '../utils/ltv_updated.service';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(LtvCredit)
    private ltvCreditRepository: Repository<LtvCredit>,
    @InjectRepository(LtvCollateral)
    private ltvCollateralRepository: Repository<LtvCollateral>,
    private ltvUpdatedUtilService: LtvUpdatedUtilService,
  ) {}

  public async handleCreditBalanceUpdatedEvent(
    credit: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    await this.ltvCreditRepository.update(
      {
        userId: credit.userId,
        calculatedAt: LessThan(credit.calculatedAt),
      },
      {
        utilizationAmount: credit.utilizationAmount,
        calculatedAt: credit.calculatedAt,
      },
    );

    if (credit.paymentDetails.type === PaymentType.liquidation) {
      await this.ltvCollateralRepository.decrement(
        {
          userId: credit.userId,
          asset: credit.paymentDetails.asset,
        },
        'amount',
        credit.paymentDetails.amount,
      );
    }

    await this.ltvUpdatedUtilService.publishLtvUpdatedEvent(credit.userId);
  }

  public async handleCreditLineCreatedEvent({
    userId,
  }: CreditLineCreatedPayload): Promise<void> {
    await this.ltvCreditRepository.insert({
      userId,
      calculatedAt: DateTime.now().toISO(),
      utilizationAmount: 0,
    });
  }
}
