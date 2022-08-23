import { PeachApiService } from '../api/peach_api.service';
import { Borrower } from '../borrower.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Credit,
  PaymentInstrument,
  Payments,
} from '../api/peach_api.interfaces';
import {
  GetPaymentsQueryDto,
  PaymentsResponseDto,
  ScheduleTransactionDto,
} from './payments.dto';
import { PaymentsResponseFactory } from './utils/payments_response.factory';
import { WebhookPaymentPayload } from '@archie/api/webhook-api/data-transfer-objects';
import { CreditLinePaymentReceivedPayload } from '@archie/api/peach-api/data-transfer-objects';
import { CREDIT_LINE_PAYMENT_RECEIVED_TOPIC } from '@archie/api/peach-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { InternalCollateralTransactionCreatedPayload } from '@archie/api/collateral-api/fireblocks';
import { InternalCollateralTransactionCompletedPayload } from '@archie/api/collateral-api/fireblocks-webhook';
import { BorrowerValidation } from '../utils/borrower.validation';

export class PaymentsService {
  constructor(
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private peachApiService: PeachApiService,
    private paymentsResponseFactory: PaymentsResponseFactory,
    private queueService: QueueService,
    private borrowerValidation: BorrowerValidation,
  ) {}

  public async getPayments(
    userId: string,
    query: GetPaymentsQueryDto,
  ): Promise<PaymentsResponseDto> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const payments: Payments = await this.peachApiService.getPayments(
      borrower.personId,
      borrower.creditLineId,
      query,
    );

    return this.paymentsResponseFactory.create(payments, query.limit);
  }

  public async scheduleTransaction(
    userId: string,
    transaction: ScheduleTransactionDto,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerDrawDefined(borrower);

    // TODO: uncomment once we get response from peach
    // const balance: PaymentInstrumentBalance =
    //   await this.peachApiService.getRefreshedBalance(
    //     borrower.personId,
    //     transaction.paymentInstrumentId,
    //   );
    //
    // if (transaction.amount > balance.availableBalanceAmount) {
    //   throw new AmountExceedsAvailableBalanceError();
    // }

    await this.peachApiService.createOneTimeTransaction(
      borrower,
      transaction.amount,
      transaction.paymentInstrumentId,
      transaction.scheduledDate,
    );
  }

  public async handlePaymentConfirmedEvent(
    payment: WebhookPaymentPayload,
  ): Promise<void> {
    const credit: Credit = await this.peachApiService.getCreditBalance(
      payment.personId,
      payment.loanId,
    );

    await this.queueService.publish<CreditLinePaymentReceivedPayload>(
      CREDIT_LINE_PAYMENT_RECEIVED_TOPIC,
      {
        ...credit,
        userId: payment.personExternalId,
      },
    );
  }

  public async handleInternalTransactionCreatedEvent(
    transaction: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: transaction.userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    let liquidationInstrumentId: string | null =
      borrower.liquidationInstrumentId;

    if (liquidationInstrumentId === null) {
      const paymentInstrument: PaymentInstrument =
        await this.peachApiService.createLiquidationPaymentInstrument(
          borrower.personId,
        );
      liquidationInstrumentId = paymentInstrument.id;

      await this.borrowerRepository.update(
        {
          userId: transaction.userId,
        },
        {
          liquidationInstrumentId,
        },
      );
    }

    await this.peachApiService.createPendingOneTimePaymentTransaction(
      borrower,
      liquidationInstrumentId,
      transaction.price,
      transaction.id,
    );
  }

  public async handleInternalTransactionCompletedEvent(
    transaction: InternalCollateralTransactionCompletedPayload,
  ): Promise<void> {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: transaction.userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    await this.peachApiService.completeTransaction(
      borrower,
      transaction.transactionId,
    );
  }
}
