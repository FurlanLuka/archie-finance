import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { Repository } from 'typeorm';
import {
  Autopay,
  Document,
  PeachPaymentInstrument,
  AutopayAgreement,
  AutopayResponse,
  CreateAutopayDocument,
  CreateAutopay,
} from '@archie/api/peach-api/data-transfer-objects/types';
import { BorrowerValidation } from '../utils/borrower.validation';

export class AutopayService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
  ) {}

  public async setupAutopay(
    userId: string,
    autopayConfiguration: CreateAutopay,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const paymentInstrument: PeachPaymentInstrument =
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

    const pdfDocument: Document =
      await this.peachApiService.convertDocumentToPdf(
        borrower.personId,
        autopayConfiguration.agreementDocumentId,
      );

    await this.peachApiService.createAutopay(
      borrower.personId,
      borrower.creditLineId,
      autopayConfiguration,
      pdfDocument.id,
    );
  }

  public async cancelAutopay(userId: string): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

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

  public async getConfiguredAutopay(userId: string): Promise<AutopayResponse> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

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
    agreement: CreateAutopayDocument,
  ): Promise<AutopayAgreement> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const paymentInstrument: PeachPaymentInstrument =
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
