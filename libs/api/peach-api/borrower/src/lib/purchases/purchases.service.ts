import { Borrower } from '../borrower.entity';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchases } from '../api/peach_api.interfaces';
import { BorrowerValidation } from '../utils/borrower.validation';
import { PurchasesResponseFactory } from './utils/purchases_response.factory';
import { GetPurchasesQueryDto } from './purchases.dto';

export class PurchasesService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
    private purchasesResponseFactory: PurchasesResponseFactory,
  ) {}

  public async getPurchases(
    userId: string,
    query: GetPurchasesQueryDto,
  ): Promise<any> {
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
