import { Injectable } from '@nestjs/common';
import { KycSubmittedPayload } from '@archie/api/user-api/kyc';
import { PeachApiService } from './api/peach_api.service';
import {
  Draw,
  HomeAddress,
  PaymentInstrument,
  Person,
} from './api/peach_api.interfaces';
import { EmailVerifiedPayload } from '@archie/api/user-api/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrower } from './borrower.entity';
import { CryptoService } from '@archie/api/utils/crypto';
import {
  CreditLimitDecreasedPayload,
  CreditLimitIncreasedPayload,
} from '@archie/api/credit-api/margin';
import { InternalCollateralTransactionCreatedPayload } from '@archie/api/collateral-api/fireblocks';
import { InternalCollateralTransactionCompletedPayload } from '@archie/api/collateral-api/fireblocks-webhook';
import {
  CardActivatedPayload,
  FundsLoadedPayload,
  TransactionUpdatedPayload,
  TransactionStatus,
} from '@archie/api/credit-api/rize';

@Injectable()
export class PeachCreditService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private cryptoService: CryptoService,
  ) {}

  public async handleKycSubmittedEvent(kyc: KycSubmittedPayload) {
    let borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: kyc.userId,
    });

    if (borrower === null) {
      const person: Person = await this.peachApiService.createPerson(kyc);
      borrower = await this.borrowerRepository.save({
        userId: kyc.userId,
        personId: person.id,
      });
    }

    await this.peachApiService.addMobilePhoneContact(borrower.personId, kyc);
    const homeAddress: HomeAddress =
      await this.peachApiService.addHomeAddressContact(borrower.personId, kyc);

    await this.borrowerRepository.update(
      { userId: kyc.userId },
      {
        homeAddressContactId: homeAddress.id,
      },
    );
  }

  public async handleEmailVerifiedEvent(email: EmailVerifiedPayload) {
    const encryptedEmail: string = this.cryptoService.encrypt(email.email);
    const borrower: Borrower = await this.borrowerRepository
      .createQueryBuilder()
      .update(Borrower, {
        encryptedEmail,
      })
      .where('userId = :userId', { userId: email.userId })
      .returning('*')
      .execute()
      .then((response) => response.raw[0]);

    await this.peachApiService.addMailContact(borrower.personId, email.email);
  }

  public async handleCardActivatedEvent(activatedCard: CardActivatedPayload) {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: activatedCard.userId,
    });
    const email: string = this.cryptoService.decrypt(borrower.encryptedEmail);

    await this.peachApiService.createUser(borrower.personId, email);
  }

  public async handleFundsLoadedEvent(founds: FundsLoadedPayload) {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: founds.userId,
    });
    const creditLineId = await this.createActiveCreditLine(
      borrower,
      founds.amount,
    );

    await this.createActiveDraw(borrower, creditLineId);
  }

  private async createActiveCreditLine(
    borrower: Borrower,
    amount: number,
  ): Promise<string> {
    let creditLineId: string | null = borrower.creditLineId;

    if (creditLineId === null) {
      const creditLine = await this.peachApiService.createCreditLine(
        borrower.personId,
        amount,
        borrower.homeAddressContactId,
      );
      creditLineId = creditLine.id;

      await this.borrowerRepository.update(
        {
          userId: borrower.userId,
        },
        {
          creditLineId: creditLine.id,
        },
      );
    }

    await this.peachApiService.activateCreditLine(
      borrower.personId,
      creditLineId,
    );

    return creditLineId;
  }

  private async createActiveDraw(borrower: Borrower, creditLineId: string) {
    let drawId: string | null = borrower.drawId;

    if (drawId === null) {
      const draw: Draw = await this.peachApiService.createDraw(
        borrower.personId,
        creditLineId,
      );
      drawId = draw.id;
      await this.borrowerRepository.update(
        {
          userId: borrower.userId,
        },
        {
          drawId,
        },
      );
    }

    await this.peachApiService.activateDraw(
      borrower.personId,
      creditLineId,
      drawId,
    );
  }

  public async handleCreditLimitIncreased(
    creditLimitIncrease: CreditLimitIncreasedPayload,
  ): Promise<void> {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: creditLimitIncrease.userId,
    });
    const currentCreditLimit = await this.peachApiService.getCreditLimit(
      borrower.personId,
      borrower.creditLineId,
    );
    const newCreditLimit: number =
      currentCreditLimit.creditLimitAmount + creditLimitIncrease.amount;

    await this.peachApiService.updateCreditLimit(
      borrower.personId,
      borrower.creditLineId,
      newCreditLimit,
    );
  }

  public async handleCreditLimitDecreased(
    creditLimitDecrease: CreditLimitDecreasedPayload,
  ): Promise<void> {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: creditLimitDecrease.userId,
    });
    const currentCreditLimit = await this.peachApiService.getCreditLimit(
      borrower.personId,
      borrower.creditLineId,
    );
    const newCreditLimit: number =
      currentCreditLimit.creditLimitAmount - creditLimitDecrease.amount;

    await this.peachApiService.updateCreditLimit(
      borrower.personId,
      borrower.creditLineId,
      newCreditLimit,
    );
  }

  public async handleTransactionsEvent(transaction: TransactionUpdatedPayload) {
    if (transaction.status === TransactionStatus.queued) {
      return;
    }
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: transaction.userId,
    });

    if (transaction.status === TransactionStatus.pending) {
      return this.peachApiService.createPurchase(
        borrower.personId,
        borrower.creditLineId,
        borrower.drawId,
        transaction,
      );
    }

    return this.peachApiService.updatePurchase(
      borrower.personId,
      borrower.creditLineId,
      borrower.drawId,
      transaction,
    );
  }

  public async handleInternalTransactionCreatedEvent(
    transaction: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: transaction.userId,
    });

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

    await this.peachApiService.completeTransaction(
      borrower,
      transaction.transactionId,
    );
  }
}
