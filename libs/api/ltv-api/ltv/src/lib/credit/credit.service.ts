import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { LtvCredit } from '../credit.entity';
import {
  CreditBalanceUpdatedPayload,
  PaymentType,
} from '@archie/api/peach-api/data-transfer-objects';
import { LtvCollateral } from '../collateral.entity';
import { CardActivatedPayload } from '@archie/api/credit-api/data-transfer-objects';
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
<<<<<<< HEAD
      await this.ltvCollateralRepository
        .createQueryBuilder('LtvCollateral')
        .update(LtvCollateral)
        .where('userId = :userId AND asset = :asset', {
          userId: credit.userId,
          asset: credit.paymentDetails.asset,
        })
        .set({
          amount: () => '"amount" - :amount',
        })
        .setParameter('amount', credit.paymentDetails.amount)
        .execute();
=======
      await this.ltvCollateralRepository.decrement(
        {
          userId: credit.userId,
          asset: credit.paymentDetails.asset,
        },
        'amount',
        credit.paymentDetails.amount,
      );
>>>>>>> credit-limit-api
    }

    await this.ltvUpdatedUtilService.publishLtvUpdatedEvent(credit.userId);
  }

  public async handleCardActivatedEvent(
    cardDetails: CardActivatedPayload,
  ): Promise<void> {
    await this.ltvCreditRepository.insert({
      userId: cardDetails.userId,
      calculatedAt: DateTime.now().toISO(),
      utilizationAmount: 0,
    });
  }
}
