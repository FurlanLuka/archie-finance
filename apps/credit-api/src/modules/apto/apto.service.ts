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
  CompleteVerificationResponse,
  CreateUserResponse,
  DataType,
  EmailDataPoint,
  IdDocumentDataPoint,
  NameDataPoint,
  PhoneDataPoint,
  StartVerificationResponse,
} from './api/apto_api.interfaces';
import { AptoVerification } from './apto_verification.entity';
import { GetKycResponse } from '@archie-microservices/api-interfaces/kyc';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import { AptoUser } from './apto_user.entity';
import {
  CompletePhoneVerificationResponse,
  StartPhoneVerificationResponse,
} from './apto.interfaces';

@Injectable()
export class AptoService {
  constructor(
    private aptoApiService: AptoApiService,
    private internalApiService: InternalApiService,
    @InjectRepository(AptoVerification)
    private aptoVerificationRepository: Repository<AptoVerification>,
    @InjectRepository(AptoUser)
    private aptoUserRepository: Repository<AptoUser>,
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
    const aptoVerification: AptoVerification =
      await this.aptoVerificationRepository.findOne({
        userId,
      });

    if (aptoVerification === undefined) {
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
    const aptoVerification: AptoVerification =
      await this.aptoVerificationRepository.findOne({
        userId,
      });

    if (aptoVerification === undefined) {
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
    const aptoVerification: AptoVerification =
      await this.aptoVerificationRepository.findOne({
        userId,
      });

    if (aptoVerification === undefined) {
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
      throw new BadRequestException('PHONE_VERIFICATION_REQUIRED_ERROR');
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
}
