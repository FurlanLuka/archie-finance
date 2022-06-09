import { VaultService } from '@archie-microservices/vault';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { InternalApiService } from '@archie-microservices/internal-api';
import { Kyc } from './kyc.entity';
import {
  CreateKycResponse,
  GetKycResponse,
} from '@archie-microservices/api-interfaces/kyc';
import { KycDto } from './kyc.dto';
import { DateTime } from 'luxon';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(Kyc) private kycRepository: Repository<Kyc>,
    private vaultService: VaultService,
    private connection: Connection,
    private internalApiService: InternalApiService,
  ) {}

  async getKyc(userId: string): Promise<GetKycResponse> {
    const kycRecord: Kyc | undefined = await this.kycRepository.findOneBy({
      userId,
    });

    if (kycRecord === undefined) {
      Logger.error({
        code: 'GET_KYC_ERROR',
        metadata: {
          userId,
        },
      });

      throw new NotFoundException(
        'KYC_NOT_FOUND',
        'KYC record not found. Please submit your KYC or contact support.',
      );
    }

    const decryptedData: string[] = await this.vaultService.decryptStrings([
      kycRecord.firstName,
      kycRecord.lastName,
      kycRecord.dateOfBirth,
      kycRecord.addressCountry,
      kycRecord.addressLocality,
      kycRecord.addressPostalCode,
      kycRecord.addressRegion,
      kycRecord.addressStreet,
      kycRecord.addressStreetNumber,
      kycRecord.phoneNumber,
      kycRecord.phoneNumberCountryCode,
      kycRecord.ssn,
    ]);

    return {
      firstName: decryptedData[0],
      lastName: decryptedData[1],
      dateOfBirth: decryptedData[2],
      addressCountry: decryptedData[3],
      addressLocality: decryptedData[4],
      addressPostalCode: decryptedData[5],
      addressRegion: decryptedData[6],
      addressStreet: decryptedData[7],
      addressStreetNumber: decryptedData[8],
      phoneNumber: decryptedData[9],
      phoneNumberCountryCode: decryptedData[10],
      ssn: decryptedData[11],
    };
  }

  async createKyc(payload: KycDto, userId: string): Promise<CreateKycResponse> {
    const kycRecord: Kyc | undefined = await this.kycRepository.findOneBy({
      userId,
    });

    if (kycRecord) {
      Logger.error({
        code: 'CREATE_KYC_ALREADY_EXISTS_ERROR',
        metadata: {
          userId,
        },
      });

      throw new BadRequestException(
        'KYC_ALREADY_SUBMITTED',
        'You have already submitted your KYC. If you made a mistake, please contact support.',
      );
    }

    const encryptedData: string[] = await this.vaultService.encryptStrings([
      payload.firstName,
      payload.lastName,
      DateTime.fromJSDate(payload.dateOfBirth).toISODate(),
      payload.addressCountry,
      payload.addressLocality,
      payload.addressPostalCode,
      payload.addressRegion,
      payload.addressStreet,
      payload.addressStreetNumber,
      payload.phoneNumber,
      payload.phoneNumberCountryCode,
      payload.ssn,
    ]);

    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(Kyc, {
        userId,
        firstName: encryptedData[0],
        lastName: encryptedData[1],
        dateOfBirth: encryptedData[2],
        addressCountry: encryptedData[3],
        addressLocality: encryptedData[4],
        addressPostalCode: encryptedData[5],
        addressRegion: encryptedData[6],
        addressStreet: encryptedData[7],
        addressStreetNumber: encryptedData[8],
        phoneNumber: encryptedData[9],
        phoneNumberCountryCode: encryptedData[10],
        ssn: encryptedData[11],
      });

      await this.internalApiService.completeOnboardingStage('kycStage', userId);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      Logger.error({
        code: 'CREATE_KYC_ERROR',
        metadata: {
          userId,
          error: JSON.stringify(error),
        },
      });

      throw new InternalServerErrorException(
        'ERR_CREATING_KYC_RECORD',
        'There was an issue creating KYC record. Please try again or contact support.',
      );
    } finally {
      await queryRunner.release();
    }

    return {
      firstName: payload.firstName,
      lastName: payload.lastName,
      dateOfBirth: DateTime.fromJSDate(payload.dateOfBirth).toISODate(),
      addressCountry: payload.addressCountry,
      addressLocality: payload.addressLocality,
      addressPostalCode: payload.addressPostalCode,
      addressRegion: payload.addressRegion,
      addressStreet: payload.addressStreet,
      addressStreetNumber: payload.addressStreetNumber,
      phoneNumber: payload.phoneNumber,
      phoneNumberCountryCode: payload.phoneNumberCountryCode,
      ssn: payload.ssn,
    };
  }
}
