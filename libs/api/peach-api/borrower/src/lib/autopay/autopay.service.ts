import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { Repository } from 'typeorm';
import { BorrowerNotFoundError } from '../borrower.errors';
import { AutopayAgreementDto, CreateAutopayDocumentDto } from './autopay.dto';
import { Document, PaymentInstrument } from '../api/peach_api.interfaces';

export class AutopayService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
  ) {}

  public async setupAutopay(userId: string) {
    // call render to document api
    // {
    //   "fmt": "pdf",
    //     "subject": "autopayAgreement",
    //     "channel": "document",
    //     "personId": "BO-2KV4-3XXB",
    //     "documentId": "DD-6JYZ-5Y9B",
    //     "context": {
    //   "lenderName": "Peachy Lender",
    //       "paymentMethod": "bankAccount",
    //       "paymentMethodLastFour": "1111",
    //       "supportPhone": "888-888-8888",
    //       "supportEmail": "support@peach.finance",
    //       "dateSigned": "Aug 19, 2022"
    // },
    //   "loanId": "LN-2BQ8-LPNJ"
    // }
    // update document status to accepted
    // documents/DD-6JYZ-5Y9B/convert?format=pdf convert document. maybe optional??
    // POST set autopay
  }

  public async deactivateAutopay(userId: string) {
    //update agreement document to archived
    // delete autopay entity
  }

  public async getConfiguredAutopay(userId: string) {}

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

    const documentHtml = await this.peachApiService.getAutopayAgreementHtml(
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
