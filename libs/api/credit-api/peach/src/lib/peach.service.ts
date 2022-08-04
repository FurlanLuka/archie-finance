import { Injectable } from '@nestjs/common';
import { KycSubmittedPayload } from '@archie/api/user-api/kyc';
import { PeachApiService } from './api/peach_api.service';
import { HomeAddress, Person } from './api/peach_api.interfaces';
import { EmailVerifiedPayload } from '@archie/api/user-api/user';
import {
  CardActivatedPayload,
  FundsLoadedPayload,
} from '../../../rize/src/lib/rize.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrower } from './borrower.entity';
import { CryptoService } from '@archie/api/utils/crypto';
import {
  CreditLimitDecreasedPayload,
  CreditLimitIncreasedPayload,
} from '@archie/api/credit-api/margin';

@Injectable()
export class PeachService {
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
    let creditLineId = borrower.loanId;

    if (creditLineId === null) {
      const creditLine = await this.peachApiService.createCreditLine(
        borrower.personId,
        founds.amount,
        borrower.homeAddressContactId,
      );
      creditLineId = creditLine.id;

      await this.borrowerRepository.update(
        {
          userId: founds.userId,
        },
        {
          loanId: creditLine.id,
        },
      );
    }

    await this.peachApiService.activateCreditLine(
      borrower.personId,
      creditLineId,
    );
  }

  public async handleCreditLimitIncreased(
    creditLimitincrease: CreditLimitIncreasedPayload,
  ) {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: creditLimitincrease.userId,
    });
    const currentCreditLimit = await this.peachApiService.getCreditLimit(
      borrower.personId,
      borrower.loanId,
    );
    const newCreditLimit: number =
      currentCreditLimit.creditLimitAmount + creditLimitincrease.amount;

    await this.peachApiService.updateCreditLimit(
      borrower.personId,
      borrower.loanId,
      newCreditLimit,
    );
  }

  public async handleCreditLimitDecreased(
    creditLimitDecrease: CreditLimitDecreasedPayload,
  ) {
    const borrower: Borrower = await this.borrowerRepository.findOneBy({
      userId: creditLimitDecrease.userId,
    });
    const currentCreditLimit = await this.peachApiService.getCreditLimit(
      borrower.personId,
      borrower.loanId,
    );
    const newCreditLimit: number =
      currentCreditLimit.creditLimitAmount - creditLimitDecrease.amount;

    await this.peachApiService.updateCreditLimit(
      borrower.personId,
      borrower.loanId,
      newCreditLimit,
    );
  }

  // TODO: create draw somewhere!

  // on rize payment event
  public addPurchase() {
    // if first purchase - activate draw
    // create purchase
  }
}
