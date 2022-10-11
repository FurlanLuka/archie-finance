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
import { GET_USER_KYC_RPC } from '@archie/api/user-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import {
  GetKycPayload,
  GetKycResponse,
} from '@archie/api/user-api/data-transfer-objects';

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

    return paymentInstruments.map((paymentInstrument: PaymentInstrument) => ({
      id: paymentInstrument.id,
      name: paymentInstrument.nickname,
      mask: paymentInstrument.accountNumberLastFour,
      subType: paymentInstrument.accountType,
    }));
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
}
