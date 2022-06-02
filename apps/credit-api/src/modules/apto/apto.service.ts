import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { AxiosError } from 'axios';

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

  public async startPhoneVerification(userId: string): Promise<void> {
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
  }

  public async finishPhoneVerification(
    userId: string,
    secret: string,
  ): Promise<void> {
    const aptoVerification: AptoVerification =
      await this.aptoVerificationRepository.findOne({
        userId,
      });

    if (aptoVerification === undefined) {
      throw new NotFoundException();
    }

    if (aptoVerification.isVerificationCompleted) {
      throw new BadRequestException();
    }

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
  }

  public async restartVerification(userId: string): Promise<void> {
    const aptoVerification: AptoVerification =
      await this.aptoVerificationRepository.findOne({
        userId,
      });

    if (aptoVerification === undefined) {
      throw new NotFoundException();
    }

    if (aptoVerification.isVerificationCompleted) {
      throw new BadRequestException();
    }

    await this.aptoApiService.restartVerificationProcess(
      aptoVerification.verificationId,
    );
  }

  public async createAptoUser(userId: string): Promise<CreateUserResponse> {
    const aptoVerification: AptoVerification =
      await this.aptoVerificationRepository.findOne({
        userId,
      });

    if (aptoVerification === undefined) {
      throw new NotFoundException();
    }

    if (!aptoVerification.isVerificationCompleted) {
      throw new BadRequestException('PHONE_VERIFICATION_REQUIRED_ERROR');
    }

    try {
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
        data_type: DataType.PHONE,
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
    } catch (error) {
      Logger.log((error as AxiosError).toJSON());

      throw new InternalServerErrorException();
    }
  }
}
