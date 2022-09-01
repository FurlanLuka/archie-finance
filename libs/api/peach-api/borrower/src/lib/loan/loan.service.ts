import { Injectable } from '@nestjs/common';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Borrower } from '../borrower.entity';
import { CryptoService } from '@archie/api/utils/crypto';
import { QueueService } from '@archie/api/utils/queue';
import {
  GetCollateralValuePayload,
  GetCollateralValueResponse,
} from '@archie/api/credit-api/collateral';
import { GET_COLLATERAL_VALUE_RPC } from '@archie/api/credit-api/constants';
import {
  CreditLimitDecreasedPayload,
  CreditLimitIncreasedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { BorrowerNotFoundError } from '../borrower.errors';
import { BorrowerValidation } from '../utils/borrower.validation';
import {
  EmailVerifiedPayload,
  KycSubmittedPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { BorrowerWithHomeAddress } from '../utils/borrower.validation.interfaces';
import { Draw, HomeAddress, Person } from '../api/peach_api.interfaces';

@Injectable()
export class PeachBorrowerService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
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

  public async handleCardActivatedEvent(activatedCard): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: activatedCard.userId,
    });
    this.borrowerValidation.isBorrowerMailDefined(borrower);

    const email: string = this.cryptoService.decrypt(borrower.encryptedEmail);

    await this.peachApiService.createUser(borrower.personId, email);
  }

  public async handleFundsLoadedEvent(founds): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: founds.userId,
    });
    this.borrowerValidation.isBorrowerHomeAddressDefined(borrower);

    const creditLineId = await this.createActiveCreditLine(
      borrower,
      founds.amount,
    );

    await this.createActiveDraw(borrower, creditLineId);
  }

  private async createActiveCreditLine(
    borrower: BorrowerWithHomeAddress,
    amount: number,
  ): Promise<string> {
    let creditLineId: string | null = borrower.creditLineId;

    if (creditLineId === null) {
      const collateralValue: GetCollateralValueResponse[] =
        await this.queueService.request<
          GetCollateralValueResponse[],
          GetCollateralValuePayload
        >(GET_COLLATERAL_VALUE_RPC, {
          userId: borrower.userId,
        });
      const downPayment: number = collateralValue.reduce(
        (price: number, collateral: GetCollateralValueResponse) =>
          price + collateral.price,
        0,
      );

      const creditLine = await this.peachApiService.createCreditLine(
        borrower.personId,
        amount,
        borrower.homeAddressContactId,
        downPayment,
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

  public async handleCreditLimitIncreased(
    creditLimitIncrease: CreditLimitIncreasedPayload,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: creditLimitIncrease.userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

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

  public async handleCreditLimitUpdated(): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: creditLimitDecrease.userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    await this.peachApiService.updateCreditLimit(
      borrower.personId,
      borrower.creditLineId,
      newCreditLimit,
    );
  }
}
