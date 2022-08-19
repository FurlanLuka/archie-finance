import { Injectable } from '@nestjs/common';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { Repository } from 'typeorm';
import { BorrowerNotFoundError } from '../borrower.errors';
import {
  PaymentInstrument,
  PaymentInstrumentBalance,
} from '../api/peach_api.interfaces';
import {
  ConnectAccountDto,
  PaymentInstrumentDto,
} from './payment_instruments.dto';

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
      await this.peachApiService.getPaymentInstruments(borrower.personId);

    return Promise.all(
      paymentInstruments.map(async (paymentInstrument: PaymentInstrument) => {
        const balance: PaymentInstrumentBalance =
          await this.peachApiService.getCachedBalance(
            borrower.personId,
            paymentInstrument.id,
          );

        return {
          id: paymentInstrument.id,
          name: paymentInstrument.nickname,
          mask: paymentInstrument.accountNumberLastFour,
          subType: paymentInstrument.accountType,
          availableBalance:
            balance.lastSuccessfulBalance.availableBalanceAmount,
          currencyISO: balance.lastSuccessfulBalance.currency,
        };
      }),
    );
  }

  public async connectAccount(
    userId: string,
    accountInfo: ConnectAccountDto,
  ): Promise<void> {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId,
    });

    await this.peachApiService.createPlaidPaymentInstrument({
      publicToken: accountInfo.publicToken,
      accountId: accountInfo.accountId,
      personId: borrower.personId,
    });
  }
}
