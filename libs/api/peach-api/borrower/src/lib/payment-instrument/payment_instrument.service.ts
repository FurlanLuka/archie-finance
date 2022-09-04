import { Injectable } from '@nestjs/common';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { Repository } from 'typeorm';
import { PaymentInstrument } from '../api/peach_api.interfaces';
import {
  ConnectAccountDto,
  PaymentInstrumentDto,
} from './payment_instruments.dto';
import { BorrowerValidation } from '../utils/borrower.validation';
import { GetKycPayload, GetKycResponse } from '@archie/api/user-api/kyc';
import { GET_USER_KYC_RPC } from '@archie/api/user-api/constants';
import { QueueService } from '@archie/api/utils/queue';

@Injectable()
export class PeachPaymentInstrumentsService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
    private queueService: QueueService,
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

    const kyc: GetKycResponse = await this.queueService.request<
      GetKycResponse,
      GetKycPayload
    >(GET_USER_KYC_RPC, {
      userId: `${userId}`,
    });

    await this.peachApiService.createPlaidPaymentInstrument(
      borrower.personId,
      accountInfo.accountId,
      accountInfo.publicToken,
      // TODO check what would happen if user enters wrong info on kyc
      `${kyc.firstName} ${kyc.lastName}`,
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

    await this.peachApiService.deletePaymentInstrument(borrower.personId, id);
  }

  public async createPaypalPaymentInstrument(userId: string): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });

    this.borrowerValidation.isBorrowerDefined(borrower);

    await this.peachApiService.createPaypalPaymentInstrument(borrower.personId);
  }
}
