import { Injectable } from '@nestjs/common';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { Repository } from 'typeorm';
import { BorrowerNotFoundError } from '../borrower.errors';
import { PaymentInstrument } from '../api/peach_api.interfaces';
import { PaymentInstrumentDto } from './payment_instruments.dto';

@Injectable()
export class PeachPaymentInstrumentsService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
  ) {}

  public async listPaymentInstruments(
    userId: string,
  ): Promise<PaymentInstrumentDto[]> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    if (borrower === null) {
      throw new BorrowerNotFoundError();
    }

    const paymentInstruments: PaymentInstrument[] =
      await this.peachApiService.getPaymentInstruments(userId);

    return paymentInstruments.map((paymentInstrument) => ({
      id: paymentInstrument.id,
      name: paymentInstrument.nickname,
      mask: paymentInstrument.accountNumberLastFour,
      subType: paymentInstrument.accountType,
      availableBalance: 100,
      currencyISO: 'USD',
    }));
  }
}
