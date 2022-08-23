import { PeachApiService } from '../api/peach_api.service';
import { Borrower } from '../borrower.entity';
import { BorrowerNotFoundError } from '../borrower.errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from '../api/peach_api.interfaces';
import { GetPaymentsQueryDto, PaymentsResponseDto } from './payments.dto';
import { PaymentsResponseFactory } from './utils/payments_response.factory';

export class PaymentsService {
  constructor(
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private peachApiService: PeachApiService,
    private paymentsResponseFactory: PaymentsResponseFactory,
  ) {}

  public async getPayments(
    userId: string,
    query: GetPaymentsQueryDto,
  ): Promise<PaymentsResponseDto> {
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

    return this.paymentsResponseFactory.create(payments, query.limit);
  }
}
