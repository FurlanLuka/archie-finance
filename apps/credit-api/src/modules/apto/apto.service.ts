import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalApiService } from '@archie-microservices/internal-api';
import { AptoApiService } from './apto.api.service';
import { StartVerificationResponse } from './apto.interfaces';
import { AptoVerification } from './apto_verification.entity';
import { GetKycResponse } from '@archie-microservices/api-interfaces/kyc';

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
        kyc.phoneNumberCountryCode,
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
}
