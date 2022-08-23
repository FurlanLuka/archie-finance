import { Borrower } from '../borrower.entity';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchases } from '../api/peach_api.interfaces';
import { BorrowerValidation } from '../utils/borrower.validation';
import { PurchasesResponseFactory } from './utils/purchases_response.factory';

export class PurchasesService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
    private purchasesResponseFactory: PurchasesResponseFactory,
  ) {}

  public async getPurchases(userId: string): Promise<any> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerDrawDefined(borrower);

    const purchases: Purchases = this.peachApiService.getPurchases(
      borrower,
      {},
    );

    return this.purchasesResponseFactory.create(purchases);
  }

  public async handleTransactionsEvent(transaction) {
    if (transaction.status === 'queued') {
      return;
    }
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: transaction.userId,
    });
    this.borrowerValidation.isBorrowerDrawDefined(borrower);

    if (transaction.status === 'pending') {
      return this.peachApiService.createPurchase(
        borrower.personId,
        borrower.creditLineId,
        borrower.drawId,
        transaction,
      );
    }

    return this.peachApiService.updatePurchase(
      borrower.personId,
      borrower.creditLineId,
      borrower.drawId,
      transaction,
    );
  }
}
