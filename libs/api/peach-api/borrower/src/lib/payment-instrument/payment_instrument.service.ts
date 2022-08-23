import { Injectable } from '@nestjs/common';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { Repository } from 'typeorm';
import { BorrowerNotFoundError } from '../borrower.errors';
import { PaymentInstrument } from '../api/peach_api.interfaces';
import {
  ConnectAccountDto,
  PaymentInstrumentDto,
} from './payment_instruments.dto';
import { BorrowerValidation } from '../utils/borrower.validation';

@Injectable()
export class PeachPaymentInstrumentsService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
  ) {}

  public async listPaymentInstruments(
    userId: string,
  ): Promise<PaymentInstrumentDto[]> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerDefined(borrower);

    const paymentInstruments: PaymentInstrument[] =
      await this.peachApiService.getPaymentInstruments(borrower.personId);

    // TODO: uncomment once we get response from Peach
    // return Promise.all(
    //   paymentInstruments.map(async (paymentInstrument: PaymentInstrument) => {
    //     const balance: PaymentInstrumentBalance =
    //       await this.peachApiService.getCachedBalance(
    //         borrower.personId,
    //         paymentInstrument.id,
    //       );
    //
    //     return {
    //       id: paymentInstrument.id,
    //       name: paymentInstrument.nickname,
    //       mask: paymentInstrument.accountNumberLastFour,
    //       subType: paymentInstrument.accountType,
    //       availableBalance:
    //         balance.lastSuccessfulBalance.availableBalanceAmount,
    //       currencyISO: balance.lastSuccessfulBalance.currency,
    //     };
    //   }),
    // );

    return Promise.all(
      paymentInstruments.map(async (paymentInstrument: PaymentInstrument) => {
        return {
          id: paymentInstrument.id,
          name: paymentInstrument.nickname,
          mask: paymentInstrument.accountNumberLastFour,
          subType: paymentInstrument.accountType,
          availableBalance: 500,
          currencyISO: 'USD',
        };
      }),
    );
  }

  public async connectAccount(
    userId: string,
    accountInfo: ConnectAccountDto,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerDefined(borrower);

    if (borrower === null) {
      throw new BorrowerNotFoundError();
    }

    await this.peachApiService.createPlaidPaymentInstrument(
      accountInfo.publicToken,
      accountInfo.accountId,
      borrower.personId,
    );
  }

  public async removePaymentInstrument(
    userId: string,
    id: string,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerDefined(borrower);

    if (borrower === null) {
      throw new BorrowerNotFoundError();
    }

    await this.peachApiService.deletePaymentInstrument(borrower.personId, id);
  }
}
