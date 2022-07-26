import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './credit.entity';
import { GetCreditResponse } from './credit.interfaces';
import { InternalApiService } from '@archie/api/utils/internal';
import {
  GetCollateralValueResponse,
  CollateralValue,
} from '@archie/api/utils/interfaces/collateral';
import {
  GetAssetListResponse,
  AssetInformation,
} from '@archie/api/utils/interfaces/asset_information';
import {
  CreateCreditMinimumCollateralError,
  CreditNotFoundError,
} from './credit.errors';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { COLLATERAL_RECEIVED_EXCHANGE } from '@archie/api/credit-api/constants';

@Injectable()
export class CreditService {
  private MINIMUM_CREDIT = 200;
  private MAXIMUM_CREDIT = 2000;

  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    private amqpConnection: AmqpConnection,
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

    let totalCollateralValue: number = this.getCreditLimit(
      collateralValue,
      assetList,
    );

    if (totalCollateralValue < this.MINIMUM_CREDIT) {
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

    this.amqpConnection.publish(COLLATERAL_RECEIVED_EXCHANGE.name, '', {
      userId,
    });

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

  public getCreditLimit(
    collateralValue: GetCollateralValueResponse,
    assetList: GetAssetListResponse,
  ): number {
    return collateralValue.reduce((sum: number, value: CollateralValue) => {
      if (assetList[value.asset] === undefined) {
        return sum;
      }

      const assetInformation: AssetInformation = assetList[value.asset];

      const actualCollateralValue: number =
        (value.price / 100) * assetInformation.ltv;

      return sum + Math.floor(actualCollateralValue);
    }, 0);
  }

  public async getCredit(userId: string): Promise<GetCreditResponse> {
    const credit: Credit | null = await this.creditRepository.findOneBy({
      userId,
    });

    if (credit === null) {
      throw new CreditNotFoundError();
    }

    return {
      availableCredit: credit.availableCredit,
      totalCredit: credit.totalCredit,
    };
  }
}
