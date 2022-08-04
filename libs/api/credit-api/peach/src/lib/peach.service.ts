import { Injectable } from '@nestjs/common';
import { KycSubmittedPayload } from '@archie/api/user-api/kyc';
import { PeachApiService } from './api/peach_api.service';
import { Person } from './api/peach_api.interfaces';
import { EmailVerifiedPayload } from '@archie/api/user-api/user';
import { CardActivatedPayload } from '../../../rize/src/lib/rize.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrower } from './borrower.entity';
import { CryptoService } from '@archie/api/utils/crypto';

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
    await this.peachApiService.addHomeAddressContact(borrower.personId, kyc);
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

  // on funds loaded event
  public onFundsLoaded() {
    // POST Create Line of Credit - zero interest
    // POST /api/people/{PERSON_ID}/loans/{LOAN_ID}/activate
    // create draw - x interest
  }

  // on rize payment event
  public addPurchase() {
    // if first purchase - activate draw
    // create purchase
  }
}
