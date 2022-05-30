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
import { CreateKycResponse, GetKycResponse } from './kyc.interfaces';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(Kyc) private kycRepository: Repository<Kyc>,
    private vaultService: VaultService,
    private connection: Connection,
    private internalApiService: InternalApiService,
  ) {}

  async getKyc(userId: string): Promise<GetKycResponse> {
    const kycRecord: Kyc | undefined = await this.kycRepository.findOne({
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
      kycRecord.address,
      kycRecord.phoneNumberCountryCode,
      kycRecord.phoneNumber,
      kycRecord.ssn,
    ]);

    return {
      firstName: decryptedData[0],
      lastName: decryptedData[1],
      dateOfBirth: decryptedData[2],
      address: decryptedData[3],
      phoneNumberCountryCode: decryptedData[4],
      phoneNumber: decryptedData[5],
      ssn: decryptedData[6],
    };
  }

  async createKyc(
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    address: string,
    phoneNumberCountryCode: string,
    phoneNumber: string,
    ssn: string,
    userId: string,
  ): Promise<CreateKycResponse> {
    const kycRecord: Kyc | undefined = await this.kycRepository.findOne({
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
      firstName,
      lastName,
      dateOfBirth,
      address,
      phoneNumberCountryCode,
      phoneNumber,
      ssn,
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
        address: encryptedData[3],
        phoneNumberCountryCode: encryptedData[4],
        phoneNumber: encryptedData[5],
        ssn: encryptedData[6],
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
      firstName,
      lastName,
      dateOfBirth,
      address,
      phoneNumberCountryCode,
      phoneNumber,
      ssn,
    };
  }
}
