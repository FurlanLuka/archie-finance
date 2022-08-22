import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { Repository } from 'typeorm';
import { BorrowerNotFoundError } from '../borrower.errors';
import {
  AutopayAgreementDto,
  AutopayDto,
  CreateAutopayDocumentDto,
  CreateAutopayDto,
} from './autopay.dto';
import {
  AmountType,
  Autopay,
  AutopaySchedule,
  Document,
  PaymentFrequency,
  PaymentInstrument,
} from '../api/peach_api.interfaces';

export class AutopayService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
  ) {}

  public async setupAutopay(
    userId: string,
    autopayConfiguration: CreateAutopayDto,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    if (borrower === null) {
      throw new BorrowerNotFoundError();
    }
    const paymentInstrument: PaymentInstrument =
      await this.peachApiService.getPaymentInstrument(
        borrower.personId,
        autopayConfiguration.paymentInstrumentId,
      );

    await this.peachApiService.convertAutopayAgreementToDocument(
      borrower.personId,
      borrower.creditLineId,
      paymentInstrument.accountNumberLastFour,
      autopayConfiguration.agreementDocumentId,
    );
    await this.peachApiService.acceptAutopayAgreementDocument(
      borrower.personId,
      autopayConfiguration.agreementDocumentId,
    );

    // documents/DD-6JYZ-5Y9B/convert?format=pdf convert document. maybe optional??
    await this.peachApiService.createAutopay(
      borrower.personId,
      borrower.creditLineId,
      autopayConfiguration,
    );
  }

  public async cancelAutopay(userId: string): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    if (borrower === null) {
      throw new BorrowerNotFoundError();
    }

    const autopay: Autopay = await this.peachApiService.getAutopay(
      borrower.personId,
      borrower.creditLineId,
    );
    await this.peachApiService.archiveAutopayAgreementDocument(
      borrower.personId,
      autopay.agreementDocumentId,
    );
    await this.peachApiService.cancelAutopay(
      borrower.personId,
      borrower.creditLineId,
    );
  }

  public async getConfiguredAutopay(userId: string): Promise<AutopayDto> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    if (borrower === null) {
      throw new BorrowerNotFoundError();
    }

    const autopay: Autopay = await this.peachApiService.getAutopay(
      borrower.personId,
      borrower.creditLineId,
    );

    return {
      type: autopay.type,
      extraAmount: autopay.extraAmount,
      isAlignedToDueDates: autopay.isAlignedToDueDates,
      paymentFrequency: autopay.paymentFrequency,
      paymentInstrumentId: autopay.paymentInstrumentId,
      cancelReason: autopay.cancelReason,
      schedule: autopay.schedule.map((autopaySchedule) => ({
        date: autopaySchedule.date,
        paymentType: autopaySchedule.paymentType,
        status: autopaySchedule.status,
        amount: autopaySchedule.amount,
        originalAmount: autopaySchedule.originalAmount,
        principalAmount: autopaySchedule.principalAmount,
        interestAmount: autopaySchedule.interestAmount,
      })),
    };
  }

  public async createAutopayAgreement(
    userId: string,
    agreement: CreateAutopayDocumentDto,
  ): Promise<AutopayAgreementDto> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    if (borrower === null) {
      throw new BorrowerNotFoundError();
    }
    const paymentInstrument: PaymentInstrument =
      await this.peachApiService.getPaymentInstrument(
        borrower.personId,
        agreement.paymentInstrumentId,
      );

    const agreementDocument: Document =
      await this.peachApiService.createAutopayAgreementDocument(
        borrower.personId,
        borrower.creditLineId,
      );

    const documentHtml: string =
      await this.peachApiService.getAutopayAgreementHtml(
        borrower.personId,
        borrower.creditLineId,
        paymentInstrument.accountNumberLastFour,
      );

    return {
      document: documentHtml,
      id: agreementDocument.id,
    };
  }
}
