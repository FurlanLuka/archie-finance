import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './credit.entity';
import { GetCreditResponse } from './credit.interfaces';
import { InternalApiService } from '@archie-microservices/internal-api';
import {
  GetCollateralValueResponse,
  CollateralValue,
} from '@archie-microservices/api-interfaces/collateral';
import {
  GetAssetListResponse,
  AssetInformation,
} from '@archie-microservices/api-interfaces/asset_information';
import { CreateCreditMinimumCollateralError } from './credit.errors';
import {
  SERVICE_NAME as ONBOARDING_SERVICE_NAME,
  EventPatterns as OnboardingServiceEventPatterns,
} from '@archie/api/onboarding-api/constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CreditService {
  private MINIMUM_CREDIT = 200;
  private MAXIMUM_CREDIT = 2000;

  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    @Inject(ONBOARDING_SERVICE_NAME)
    private onboardingServiceClient: ClientProxy,
    private internalApiService: InternalApiService,
  ) {}

  public async createCredit(userId: string): Promise<GetCreditResponse> {
    const creditRecord: Credit | null = await this.creditRepository.findOneBy({
      userId,
    });

    if (creditRecord) {
      return {
        totalCredit: creditRecord.totalCredit,
        availableCredit: creditRecord.availableCredit,
      };
    }

    const collateralValue: GetCollateralValueResponse =
      await this.internalApiService.getUserCollateralValue(userId);

    const assetList: GetAssetListResponse =
      await this.internalApiService.getAssetList();

    let totalCollateralValue: number = collateralValue.reduce(
      (sum: number, value: CollateralValue) => {
        if (assetList[value.asset] === undefined) {
          return sum;
        }

        const assetInformation: AssetInformation = assetList[value.asset];

        const actualCollateralValue: number =
          (value.price / 100) * assetInformation.ltv;

        return sum + Math.floor(actualCollateralValue);
      },
      0,
    );

    if (totalCollateralValue < this.MINIMUM_CREDIT) {
      Logger.error({
        code: 'CREATE_CREDIT_MINIMUM_COLLATERAL_ERROR',
        metadata: {
          userId,
        },
      });

      throw new CreateCreditMinimumCollateralError(this.MINIMUM_CREDIT);
    }

    if (totalCollateralValue > this.MAXIMUM_CREDIT) {
      Logger.warn({
        code: 'CREATE_CREDIT_MAXIMUM_COLLATERAL_VALUE_EXCEEDED',
        metadata: {
          userId,
        },
      });

      totalCollateralValue = this.MAXIMUM_CREDIT;
    }

    this.onboardingServiceClient.emit(
      OnboardingServiceEventPatterns.COMPLETE_ONBOARDING_STAGE,
      {
        stage: 'collateralizationStage',
        userId,
      },
    );

    await this.creditRepository.save({
      userId,
      totalCredit: totalCollateralValue,
      availableCredit: totalCollateralValue,
    });

    return {
      availableCredit: totalCollateralValue,
      totalCredit: totalCollateralValue,
    };
  }

  public async getCredit(userId: string): Promise<GetCreditResponse> {
    const credit: Credit | null = await this.creditRepository.findOneBy({
      userId,
    });

    if (credit === null) {
      throw new NotFoundException();
    }

    return {
      availableCredit: credit.availableCredit,
      totalCredit: credit.totalCredit,
    };
  }
}
