import { PeachApiService } from '../api/peach_api.service';
import { Borrower } from '../borrower.entity';
import { BorrowerNotFoundError } from '../borrower.errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from '../api/peach_api.interfaces';
import { GetPaymentsQueryDto } from './payments.dto';

export class PaymentsService {
  constructor(
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private peachApiService: PeachApiService,
  ) {}

  public async getPayments(userId: string, query: GetPaymentsQueryDto) {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    if (borrower === null) {
      throw new BorrowerNotFoundError();
    }

    const payments: Payments = await this.peachApiService.getPayments(
      borrower.personId,
      borrower.creditLineId,
      query,
    );

    return {
      meta: {
        total: payments.total,
        count: payments.count,
        nextUrl: payments.nextUrl, // TODO: construct your own,
        previousUrl: payments.previousUrl, // TODO: construct your own,
      },
      data: payments.data.map((payment) => ({
        id: payment.id,
        created_at: payment.created_at,
        isExternal: payment.isExternal,
        status: payment.status,
        transactionType: payment.transactionType,
        paymentDetails: {
          type: payment.paymentDetails.type,
          reason: payment.paymentDetails.reason,
          fromInstrumentId: payment.paymentDetails.fromInstrumentId,
        },
        actualAmount: payment.actualAmount,
        currency: payment.currency,
        failureDescriptionShort: payment.failureDescriptionShort,
        failureDescriptionLong: payment.failureDescriptionLong,
        autopayPlanId: payment.autopayPlanId,
        cancelReason: payment.cancelReason,
      })),
    };
  }
}
