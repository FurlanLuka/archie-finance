import { Borrower } from '../borrower.entity';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowerNotFoundError } from '../borrower.errors';
import { Purchases } from '../api/peach_api.interfaces';

export class PurchasesService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
  ) {}

  public async getPurchases(userId: string): Promise<any> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });

    if (borrower === null) {
      throw new BorrowerNotFoundError();
    }

    const purchases: Purchases = this.peachApiService.getPurchases(
      borrower.personId,
      borrower.creditLineId,
      borrower.drawId,
      {},
    );
  }

  public async handleTransactionsEvent(transaction) {
    if (transaction.status === 'queued') {
      return;
    }
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: transaction.userId,
    });

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
