import { Borrower } from '../borrower.entity';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit, Purchases } from '../api/peach_api.interfaces';
import { BorrowerValidation } from '../utils/borrower.validation';
import { PurchasesResponseFactory } from './utils/purchases_response.factory';
import { GetPurchasesQueryDto, PurchasesResponseDto } from './purchases.dto';
import { Injectable } from '@nestjs/common';
import { TransactionUpdatedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { PaymentType } from '@archie/api/peach-api/data-transfer-objects';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { QueueService } from '@archie/api/utils/queue';

@Injectable()
export class PurchasesService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
    private purchasesResponseFactory: PurchasesResponseFactory,
    private queueService: QueueService,
  ) {}

  public async getPurchases(
    userId: string,
    query: GetPurchasesQueryDto,
  ): Promise<PurchasesResponseDto> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerDrawDefined(borrower);

    const purchases: Purchases = await this.peachApiService.getPurchases(
      borrower,
      query,
    );

    return this.purchasesResponseFactory.create(purchases, query.limit);
  }

  public async handleTransactionsEvent(
    transaction: TransactionUpdatedPayload,
  ): Promise<void> {
    if (transaction.status === 'queued') {
      return;
    }
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: transaction.userId,
    });
    this.borrowerValidation.isBorrowerDrawDefined(borrower);

    if (transaction.status === 'pending') {
      await this.peachApiService.createPurchase(
        borrower.personId,
        borrower.creditLineId,
        borrower.drawId,
        transaction,
      );

      const credit: Credit = await this.peachApiService.getCreditBalance(
        borrower.personId,
        borrower.creditLineId,
      );
      this.queueService.publishEvent(CREDIT_BALANCE_UPDATED_TOPIC, {
        ...credit,
        userId: transaction.userId,
        paymentDetails: {
          type: PaymentType.purchase,
          amount: transaction.us_dollar_amount,
          asset: 'USD',
          id: String(transaction.id),
        },
      });
    } else {
      await this.peachApiService.updatePurchase(
        borrower.personId,
        borrower.creditLineId,
        borrower.drawId,
        transaction,
      );
    }
  }
}
