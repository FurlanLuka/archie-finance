import { Injectable } from '@nestjs/common';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { Borrower } from '../borrower.entity';
import { CryptoService } from '@archie/api/utils/crypto';
import { QueueService } from '@archie/api/utils/queue';
import { BorrowerNotFoundError } from '../borrower.errors';
import { BorrowerValidation } from '../utils/borrower.validation';
import {
  EmailVerifiedPayload,
  KycSubmittedPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { BorrowerWithHomeAddress } from '../utils/borrower.validation.interfaces';
import { Credit, Draw, HomeAddress, Person } from '../api/peach_api.interfaces';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { LastCreditLimitUpdate } from '../last_credit_limit_update.entity';
import { Lock } from '@archie-microservices/api/utils/redis';
import {
  CreditLineUpdatedPayload,
  CreditLineCreatedPayload,
} from '@archie/api/credit-line-api/data-transfer-objects';

@Injectable()
export class PeachBorrowerService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    @InjectRepository(LastCreditLimitUpdate)
    private lastCreditLimitUpdateRepository: Repository<LastCreditLimitUpdate>,
    private cryptoService: CryptoService,
    private queueService: QueueService,
    private borrowerValidation: BorrowerValidation,
  ) {}

  public async handleKycSubmittedEvent(
    kyc: KycSubmittedPayload,
  ): Promise<void> {
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

  public async handleEmailVerifiedEvent(
    email: EmailVerifiedPayload,
  ): Promise<void> {
    const encryptedEmail: string = this.cryptoService.encrypt(email.email);
    const borrower: Borrower | undefined = await this.borrowerRepository
      .createQueryBuilder()
      .update(Borrower, {
        encryptedEmail,
      })
      .where('userId = :userId', { userId: email.userId })
      .returning('*')
      .execute()
      .then((response: UpdateResult) => (<Borrower[]>response.raw)[0]);

    if (borrower === undefined) {
      throw new BorrowerNotFoundError();
    }

    await this.peachApiService.addMailContact(borrower.personId, email.email);
  }

  public async handleCreditLineCreatedEvent(
    createdCreditLine: CreditLineCreatedPayload,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: createdCreditLine.userId,
    });
    this.borrowerValidation.isBorrowerMailDefined(borrower);
    this.borrowerValidation.isBorrowerHomeAddressDefined(borrower);

    const email: string = this.cryptoService.decrypt(borrower.encryptedEmail);

    await this.peachApiService.createUser(borrower.personId, email);

    const creditLineId = await this.createActiveCreditLine(
      borrower,
      createdCreditLine,
    );

    await this.createActiveDraw(borrower, creditLineId);
  }

  private async createActiveCreditLine(
    borrower: BorrowerWithHomeAddress,
    createdCreditLine: CreditLineCreatedPayload,
  ): Promise<string> {
    let creditLineId: string | null = borrower.creditLineId;

    if (creditLineId === null) {
      const creditLine = await this.peachApiService.createCreditLine(
        borrower.personId,
        createdCreditLine.creditLimit,
        borrower.homeAddressContactId,
        createdCreditLine.ledgerValue,
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

    await this.lastCreditLimitUpdateRepository.upsert(
      {
        borrower: borrower,
        calculatedAt: createdCreditLine.calculatedAt,
      },
      {
        conflictPaths: ['borrower'],
      },
    );

    await this.peachApiService.activateCreditLine(
      borrower.personId,
      creditLineId,
    );

    return creditLineId;
  }

  private async createActiveDraw(
    borrower: Borrower,
    creditLineId: string,
  ): Promise<void> {
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

  @Lock((payload: CreditLineUpdatedPayload) => payload.userId)
  public async handleCreditLineUpdatedEvent(
    creditLimit: CreditLineUpdatedPayload,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: creditLimit.userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const updatedResult: UpdateResult =
      await this.lastCreditLimitUpdateRepository.update(
        {
          borrower: { uuid: borrower.uuid },
          calculatedAt: LessThanOrEqual(creditLimit.calculatedAt),
        },
        {
          calculatedAt: creditLimit.calculatedAt,
        },
      );

    if (updatedResult.affected !== 0) {
      await this.peachApiService.updateCreditLimit(
        borrower.personId,
        borrower.creditLineId,
        creditLimit.creditLimit,
      );
    }

    const credit: Credit = await this.peachApiService.getCreditBalance(
      borrower.personId,
      borrower.creditLineId,
    );

    this.queueService.publish<CreditBalanceUpdatedPayload>(
      CREDIT_BALANCE_UPDATED_TOPIC,
      {
        ...credit,
        userId: creditLimit.userId,
      },
    );
  }
}
