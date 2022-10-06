import { PeachApiService } from '../api/peach_api.service';
import { Borrower } from '../borrower.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Credit,
  PaymentInstrument,
  Payments,
  PeachOneTimePaymentStatus,
} from '../api/peach_api.interfaces';
import {
  GetPaymentsQueryDto,
  PaymentsResponseDto,
  ScheduleTransactionDto,
} from './payments.dto';
import { PaymentsResponseFactory } from './utils/payments_response.factory';
import { PeachWebhookPaymentPayload } from '@archie/api/webhook-api/data-transfer-objects';
import {
  CreditBalanceUpdatedPayload,
  PaymentType,
} from '@archie/api/peach-api/data-transfer-objects';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { BorrowerValidation } from '../utils/borrower.validation';
import { Injectable } from '@nestjs/common';
import { PaypalPaymentReceivedPayload } from '@archie/api/paypal-api/paypal';
import {
  InternalCollateralTransactionCompletedPayload,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';
import {
  LedgerAccountUpdatedPayload,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects';

@Injectable()
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
    payment: PeachWebhookPaymentPayload,
  ): Promise<void> {
    const credit: Credit = await this.peachApiService.getCreditBalance(
      payment.personId,
      payment.loanId,
    );

    this.queueService.publish<CreditBalanceUpdatedPayload>(
      CREDIT_BALANCE_UPDATED_TOPIC,
      {
        ...credit,
        userId: payment.personExternalId,
        paymentDetails: {
          type: PaymentType.payment,
          amount: payment.amount,
          asset: payment.currency,
          id: payment.id,
        },
      },
    );
  }

  public async handleInternalTransactionCreatedEvent(
    transaction: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
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

    await this.peachApiService.tryCreatingOneTimePaymentTransaction(
      borrower,
      liquidationInstrumentId,
      transaction.price,
      transaction.id,
      PeachOneTimePaymentStatus.pending,
    );

    const credit: Credit = await this.peachApiService.getCreditBalance(
      borrower.personId,
      borrower.creditLineId,
    );
    this.queueService.publish<CreditBalanceUpdatedPayload>(
      CREDIT_BALANCE_UPDATED_TOPIC,
      {
        ...credit,
        userId: transaction.userId,
        paymentDetails: {
          type: PaymentType.liquidation,
          amount: transaction.amount,
          asset: transaction.asset,
          id: transaction.id,
        },
      },
    );
  }

  public async handleCollateralLiquidationEvent({
    userId,
    action,
  }: LedgerAccountUpdatedPayload): Promise<void> {
    if (action.type !== LedgerActionType.LIQUIDATION) {
      return;
    }

    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
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
          userId: userId,
        },
        {
          liquidationInstrumentId,
        },
      );
    }

    await this.peachApiService.tryCreatingOneTimePaymentTransaction(
      borrower,
      liquidationInstrumentId,
      Number(action.liquidation.usdAmount),
      action.liquidation.id,
      PeachOneTimePaymentStatus.succeeded,
    );

    const credit: Credit = await this.peachApiService.getCreditBalance(
      borrower.personId,
      borrower.creditLineId,
    );
    this.queueService.publish<CreditBalanceUpdatedPayload>(
      CREDIT_BALANCE_UPDATED_TOPIC,
      {
        ...credit,
        userId: userId,
        paymentDetails: {
          type: PaymentType.liquidation,
          amount: action.liquidation.usdAmount,
          asset: 'USD',
          id: action.liquidation.id,
        },
      },
    );
  }

  public async handleInternalTransactionCompletedEvent(
    transaction: InternalCollateralTransactionCompletedPayload,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: transaction.userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    await this.peachApiService.completeTransaction(
      borrower,
      transaction.transactionId,
    );
  }

  public async handlePaypalPaymentReceivedEvent(
    payload: PaypalPaymentReceivedPayload,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: payload.userId,
    });

    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    let paypalInstrumentId: string | null = borrower.paypalInstrumentId;

    if (paypalInstrumentId === null) {
      const paymentInstrument: PaymentInstrument =
        await this.peachApiService.createPaypalPaymentInstrument(
          borrower.personId,
        );

      paypalInstrumentId = paymentInstrument.id;

      await this.borrowerRepository.update(
        {
          userId: payload.userId,
        },
        {
          paypalInstrumentId,
        },
      );
    }

    await this.peachApiService.tryCreatingOneTimePaymentTransaction(
      borrower,
      paypalInstrumentId,
      payload.amount,
      payload.orderId,
      PeachOneTimePaymentStatus.succeeded,
    );

    const credit: Credit = await this.peachApiService.getCreditBalance(
      borrower.personId,
      borrower.creditLineId,
    );

    this.queueService.publish<CreditBalanceUpdatedPayload>(
      CREDIT_BALANCE_UPDATED_TOPIC,
      {
        ...credit,
        userId: payload.userId,
        paymentDetails: {
          type: PaymentType.payment,
          amount: payload.amount,
          asset: payload.currency,
          id: payload.orderId,
        },
      },
    );
  }

  // TODO: Handle failed transaction
}
