import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalApiService } from '@archie-microservices/internal-api';
import { AptoApiService } from './api/apto_api.service';
import {
  AddressDataPoint,
  BirthdateDataPoint,
  CardApplicationResponse,
  CompleteVerificationResponse,
  CreateUserResponse,
  DataType,
  EmailDataPoint,
  IdDocumentDataPoint,
  IssueCardResponse,
  NameDataPoint,
  PhoneDataPoint,
  StartVerificationResponse,
} from './api/apto_api.interfaces';
import { AptoVerification } from './apto_verification.entity';
import { GetKycResponse } from '@archie-microservices/api-interfaces/kyc';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import { AptoUser } from './apto_user.entity';
import {
  AptoCardApplicationNextAction,
  AptoCardApplicationStatus,
  CompletePhoneVerificationResponse,
  StartPhoneVerificationResponse,
} from './apto.interfaces';
import { AptoCardApplication } from './apto_card_application.entity';
import { ConfigService } from '@archie/api/utils/config';
import {
  CARD_ACTIVATED_EXCHANGE,
  PHONE_NUMBER_VERIFIED_EXCHANGE,
  ConfigVariables,
} from '@archie/api/credit-api/constants';
import { AptoCard } from './apto_card.entity';
import { CreditService } from '../credit/credit.service';
import { GetCreditResponse } from '../credit/credit.interfaces';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AptoService {
  constructor(
    private aptoApiService: AptoApiService,
    private internalApiService: InternalApiService,
    private configService: ConfigService,
    @InjectRepository(AptoVerification)
    private aptoVerificationRepository: Repository<AptoVerification>,
    @InjectRepository(AptoUser)
    private aptoUserRepository: Repository<AptoUser>,
    @InjectRepository(AptoCardApplication)
    private aptoCardApplicationRepository: Repository<AptoCardApplication>,
    @InjectRepository(AptoCard)
    private aptoCardRepository: Repository<AptoCard>,
    private creditService: CreditService,
    private amqpConnection: AmqpConnection,
  ) {}

  public async startPhoneVerification(
    userId: string,
  ): Promise<StartPhoneVerificationResponse> {
    const kyc: GetKycResponse = await this.internalApiService.getKyc(userId);

    const startPhoneVerificationResponse: StartVerificationResponse =
      await this.aptoApiService.startVerificationProcess(
        kyc.phoneNumberCountryCode.replace('+', ''),
        kyc.phoneNumber,
      );

    await this.aptoVerificationRepository.save({
      userId,
      verificationId: startPhoneVerificationResponse.verification_id,
    });

    return {
      verificationId: startPhoneVerificationResponse.verification_id,
      status: startPhoneVerificationResponse.status,
    };
  }

  public async finishPhoneVerification(
    userId: string,
    secret: string,
  ): Promise<CompletePhoneVerificationResponse> {
    const aptoVerification: AptoVerification | null =
      await this.aptoVerificationRepository.findOneBy({
        userId,
      });

    if (aptoVerification === null) {
      Logger.error({
        code: 'APTO_VERIFICATION_NOT_STARTED_ERROR',
        metadata: {
          userId,
        },
      });

      throw new NotFoundException();
    }

    if (aptoVerification.isVerificationCompleted) {
      Logger.error({
        code: 'APTO_VERIFICATION_ALREADY_COMPLETED_ERROR',
        metadata: {
          userId,
        },
      });

      throw new BadRequestException();
    }

    Logger.log({
      code: 'finish_phone_verification_secret',
      secret: secret,
    });

    const completePhoneVerificationResponse: CompleteVerificationResponse =
      await this.aptoApiService.completeVerificationProcess(
        aptoVerification.verificationId,
        secret,
      );

    this.amqpConnection.publish(PHONE_NUMBER_VERIFIED_EXCHANGE.name, '', {
      userId,
    });

    await this.aptoVerificationRepository.update(
      {
        userId,
      },
      {
        isVerificationCompleted: true,
      },
    );

    return {
      verificationId: completePhoneVerificationResponse.verification_id,
      status: completePhoneVerificationResponse.status,
    };
  }

  public async restartVerification(
    userId: string,
  ): Promise<StartPhoneVerificationResponse> {
    const aptoVerification: AptoVerification | null =
      await this.aptoVerificationRepository.findOneBy({
        userId,
      });

    if (aptoVerification === null) {
      Logger.error({
        code: 'APTO_VERIFICATION_NOT_STARTED_ERROR',
        metadata: {
          userId,
        },
      });

      throw new NotFoundException();
    }

    if (aptoVerification.isVerificationCompleted) {
      Logger.error({
        code: 'APTO_VERIFICATION_ALREADY_COMPLETED_ERROR',
        metadata: {
          userId,
        },
      });

      throw new BadRequestException();
    }

    const restartPhoneVerificationResponse: StartVerificationResponse =
      await this.aptoApiService.restartVerificationProcess(
        aptoVerification.verificationId,
      );

    return {
      verificationId: restartPhoneVerificationResponse.verification_id,
      status: restartPhoneVerificationResponse.status,
    };
  }

  public async createAptoUser(userId: string): Promise<CreateUserResponse> {
    const aptoVerification: AptoVerification | null =
      await this.aptoVerificationRepository.findOneBy({
        userId,
      });

    if (aptoVerification === null) {
      Logger.error({
        code: 'APTO_VERIFICATION_NOT_STARTED_ERROR',
        metadata: {
          userId,
        },
      });

      throw new NotFoundException();
    }

    if (!aptoVerification.isVerificationCompleted) {
      Logger.error({
        code: 'APTO_VERIFICATION_NOT_COMPLETED_ERROR',
        metadata: {
          userId,
        },
      });

      throw new BadRequestException();
    }

    const kyc: GetKycResponse = await this.internalApiService.getKyc(userId);
    const emailAddressResponse: GetEmailAddressResponse =
      await this.internalApiService.getUserEmailAddress(userId);

    const birthdateDataPoint: BirthdateDataPoint = {
      type: DataType.BIRTHDATE,
      date: kyc.dateOfBirth,
    };

    const emailDataPoint: EmailDataPoint = {
      type: DataType.EMAIL,
      email: emailAddressResponse.email,
    };

    const nameDataPoint: NameDataPoint = {
      type: DataType.NAME,
      first_name: kyc.firstName,
      last_name: kyc.lastName,
    };

    const addressDataPoint: AddressDataPoint = {
      type: DataType.ADDRESS,
      street_one: `${kyc.addressStreet} ${kyc.addressStreetNumber}`,
      street_two: '',
      locality: kyc.addressLocality,
      region: kyc.addressRegion,
      postal_code: kyc.addressPostalCode,
      country: kyc.addressCountry,
    };

    const idDocumentDataPoint: IdDocumentDataPoint = {
      data_type: DataType.ID_DOCUMENT,
      value: kyc.ssn,
      country: kyc.addressCountry,
      doc_type: 'SSN',
    };

    const phoneDataPoint: PhoneDataPoint = {
      type: DataType.PHONE,
      verification: {
        verification_id: aptoVerification.verificationId,
      },
      country_code: kyc.phoneNumberCountryCode.replace('+', ''),
      phone_number: kyc.phoneNumber,
    };

    const user: CreateUserResponse = await this.aptoApiService.createUser(
      userId,
      phoneDataPoint,
      emailDataPoint,
      birthdateDataPoint,
      nameDataPoint,
      addressDataPoint,
      idDocumentDataPoint,
    );

    await this.aptoUserRepository.save({
      userId,
      aptoUserId: user.user_id,
      accessToken: user.user_token,
    });

    return user;
  }

  private async acceptAgreements(
    userAccessToken: string,
    workflowObjectId: string,
    nextActionId: string,
  ): Promise<void> {
    // await this.aptoApiService.setAgreementStatus(userAccessToken);
    await this.aptoApiService.acceptAgreements(
      userAccessToken,
      workflowObjectId,
      nextActionId,
    );
  }

  private async getAndUpdateCardApplication(
    userAccessToken: string,
    aptoCardApplication: AptoCardApplication,
  ): Promise<AptoCardApplication> {
    const cardApplicationResponse: CardApplicationResponse =
      await this.aptoApiService.getCardApplication(
        userAccessToken,
        aptoCardApplication.applicationId,
      );

    const cardApplication: AptoCardApplication = {
      ...aptoCardApplication,
      applicationStatus: cardApplicationResponse.status,
      nextAction: cardApplicationResponse.next_action.name,
      nextActionId: cardApplicationResponse.next_action.action_id,
      workflowObjectId: cardApplicationResponse.workflow_object_id,
    };

    await this.aptoCardApplicationRepository.save(cardApplication);

    return cardApplication;
  }

  public async getAptoUser(userId: string): Promise<AptoUser> {
    const aptoUser: AptoUser | null = await this.aptoUserRepository.findOneBy({
      userId,
    });

    if (aptoUser === null) {
      Logger.error({
        code: 'APTO_USER_DOESNT_EXIST_ERROR',
        metadata: {
          userId,
        },
      });

      throw new BadRequestException();
    }

    return aptoUser;
  }

  public async issueCard(userId: string): Promise<IssueCardResponse> {
    const aptoUser: AptoUser = await this.getAptoUser(userId);

    const aptoCardApplication: AptoCardApplication | null =
      await this.aptoCardApplicationRepository.findOneBy({
        userId,
      });

    if (aptoCardApplication) {
      if (
        aptoCardApplication.applicationStatus ===
        AptoCardApplicationStatus.APPROVED
      ) {
        Logger.error({
          code: 'CARD_APPLICATION_ALREADY_APPROVED',
          metadata: {
            userId,
          },
        });

        throw new BadRequestException();
      }

      return this.completeCardIssuanceSteps(
        aptoUser.accessToken,
        aptoCardApplication,
      );
    }

    const cardApplicationResponse: CardApplicationResponse =
      await this.aptoApiService.applyForCardPrograme(
        aptoUser.accessToken,
        this.configService.get(ConfigVariables.APTO_CARD_PROGRAME_ID),
      );

    const cardApplication: AptoCardApplication = {
      userId,
      applicationId: cardApplicationResponse.id,
      applicationStatus: cardApplicationResponse.status,
      nextAction: cardApplicationResponse.next_action.name,
      nextActionId: cardApplicationResponse.next_action.action_id,
      workflowObjectId: cardApplicationResponse.workflow_object_id,
    };

    await this.aptoCardApplicationRepository.save(cardApplication);

    return this.completeCardIssuanceSteps(
      aptoUser.accessToken,
      cardApplication,
    );
  }

  private async completeCardIssuanceSteps(
    userAccessToken: string,
    aptoCardApplication: AptoCardApplication,
  ): Promise<IssueCardResponse> {
    if (
      aptoCardApplication.nextAction ===
      AptoCardApplicationNextAction.SHOW_CARDHOLDER_AGREEMENT
    ) {
      await this.acceptAgreements(
        userAccessToken,
        aptoCardApplication.workflowObjectId,
        aptoCardApplication.nextActionId,
      );

      const updatedCardApplication: AptoCardApplication =
        await this.getAndUpdateCardApplication(
          userAccessToken,
          aptoCardApplication,
        );

      return this.completeCardIssuanceSteps(
        userAccessToken,
        updatedCardApplication,
      );
    }

    if (
      aptoCardApplication.nextAction ===
      AptoCardApplicationNextAction.ISSUE_CARD
    ) {
      const issueCardResponse: IssueCardResponse =
        await this.aptoApiService.issueCard(
          userAccessToken,
          aptoCardApplication.applicationId,
        );

      await this.aptoCardRepository.save({
        userId: aptoCardApplication.userId,
        cardId: issueCardResponse.account_id,
      });

      this.amqpConnection.publish(CARD_ACTIVATED_EXCHANGE.name, '', {
        userId: aptoCardApplication.userId,
      });

      await this.initiallyLoadCard(
        aptoCardApplication.userId,
        userAccessToken,
        issueCardResponse.account_id,
      );

      return issueCardResponse;
    }

    throw new BadRequestException();
  }

  public async initiallyLoadCard(
    userId: string,
    userAccessToken: string,
    cardId: string,
  ): Promise<void> {
    const credit: GetCreditResponse = await this.creditService.getCredit(
      userId,
    );

    await this.aptoApiService.loadFunds(cardId, credit.availableCredit);
  }
}
