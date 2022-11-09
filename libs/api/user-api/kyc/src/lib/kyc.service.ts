import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kyc } from './kyc.entity';
import { DateTime } from 'luxon';
import { KycAlreadySubmitted, KycNotFoundError } from './kyc.errors';
import { KYC_SUBMITTED_TOPIC } from '@archie/api/user-api/constants';
import { CryptoService } from '@archie/api/utils/crypto';
import { QueueService } from '@archie/api/utils/queue';
import { KycResponse } from '@archie/api/user-api/data-transfer-objects/types';
import { KycDto } from '@archie/api/user-api/data-transfer-objects';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(Kyc) private kycRepository: Repository<Kyc>,
    private queueService: QueueService,
    private cryptoService: CryptoService,
  ) {}

  async getKyc(userId: string): Promise<KycResponse> {
    const kycRecord: Kyc | null = await this.kycRepository.findOneBy({
      userId,
    });

    if (kycRecord === null) {
      throw new KycNotFoundError();
    }

    const decryptedData: string[] = this.cryptoService.decryptMultiple([
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
      kycRecord.income,
    ]);
    const decryptedAptUnit: string | null =
      kycRecord.aptUnit !== null
        ? this.cryptoService.decrypt(kycRecord.aptUnit)
        : null;

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
      income: Number(decryptedData[12]),
      aptUnit: decryptedAptUnit,
      createdAt: DateTime.fromJSDate(kycRecord.createdAt).toISODate(),
    };
  }

  async createKyc(payload: KycDto, userId: string): Promise<KycResponse> {
    const kycRecord: Kyc | null = await this.kycRepository.findOneBy({
      userId,
    });

    if (kycRecord) {
      throw new KycAlreadySubmitted();
    }

    const encryptedData: string[] = this.cryptoService.encryptMultiple([
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
      String(payload.income),
    ]);
    const encryptedAptUnit: string | null =
      payload.aptUnit !== null
        ? this.cryptoService.encrypt(payload.aptUnit)
        : null;

    const kyc: Kyc = await this.kycRepository.save({
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
      income: encryptedData[12],
      aptUnit: encryptedAptUnit,
    });

    this.queueService.publishEvent(KYC_SUBMITTED_TOPIC, {
      userId,
      ...payload,
    });

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
      income: payload.income,
      aptUnit: payload.aptUnit,
      createdAt: DateTime.fromJSDate(kyc.createdAt).toISODate(),
    };
  }
}
