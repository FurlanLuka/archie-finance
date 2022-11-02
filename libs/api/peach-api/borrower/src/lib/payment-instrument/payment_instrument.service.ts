import { Injectable } from '@nestjs/common';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { Repository } from 'typeorm';
import { PaymentInstrument as PeachPaymentInstrument } from '../api/peach_api.interfaces';
import {
  ConnectAccountBody,
  PaymentInstrument,
} from '@archie/api/peach-api/data-transfer-objects/types';
import { BorrowerValidation } from '../utils/borrower.validation';
import { GET_USER_KYC_RPC } from '@archie/api/user-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import {
  GetKycPayload,
  KycResponse,
} from '@archie/api/user-api/data-transfer-objects/types';

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
  ): Promise<PaymentInstrument[]> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerDefined(borrower);

    const paymentInstruments: PeachPaymentInstrument[] =
      await this.peachApiService.getPaymentInstruments(borrower.personId);

    return paymentInstruments.map(
      (paymentInstrument: PeachPaymentInstrument) => ({
        id: paymentInstrument.id,
        name: paymentInstrument.nickname,
        mask: paymentInstrument.accountNumberLastFour,
        subType: paymentInstrument.accountType,
      }),
    );
  }

  public async connectAccount(
    userId: string,
    accountInfo: ConnectAccountBody,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerDefined(borrower);

    const kyc: KycResponse = await this.queueService.request<
      KycResponse,
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
