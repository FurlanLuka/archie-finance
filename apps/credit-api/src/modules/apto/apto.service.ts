import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalApiService } from '@archie-microservices/internal-api';
import { AptoApiService } from './api/apto_api.service';
import {
  AddressDataPoint,
  BirthdateDataPoint,
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

@Injectable()
export class AptoService {
  constructor(
    private aptoApiService: AptoApiService,
    private internalApiService: InternalApiService,
    @InjectRepository(AptoVerification)
    private aptoVerificationRepository: Repository<AptoVerification>,
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

  public async createAptoUser(userId: string): Promise<void> {
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
      verified: true,
      verification: {
        type: 'verification',
        verification_id: aptoVerification.verificationId,
        status: 'passed',
        verification_mechanism: 'phone',
        verification_type: 'phone',
      },
      not_specified: false,
      country_code: kyc.phoneNumberCountryCode.replace('+', ''),
      phone_number: kyc.phoneNumber,
    };

    await this.aptoApiService.createUser(
      userId,
      phoneDataPoint,
      emailDataPoint,
      birthdateDataPoint,
      nameDataPoint,
      addressDataPoint,
      idDocumentDataPoint,
    );
  }
}
