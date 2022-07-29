import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './credit.entity';
import { GetCreditResponse } from './credit.interfaces';
import {
  CreateCreditMinimumCollateralError,
  CreditNotFoundError,
} from './credit.errors';
import {
  COLLATERAL_RECEIVED_TOPIC,
  GET_COLLATERAL_VALUE_RPC,
} from '@archie/api/credit-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import {
  AssetInformation,
  AssetList,
} from '@archie/api/collateral-api/asset-information';
import { GET_ASSET_INFORMATION_RPC } from '@archie/api/collateral-api/constants';
import { GetCollateralValuePayload, GetCollateralValueResponse } from '@archie/api/credit-api/collateral';

@Injectable()
export class CreditService {
  private MINIMUM_CREDIT = 200;
  private MAXIMUM_CREDIT = 2000;

  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    private queueService: QueueService,
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

    const collateralValue: GetCollateralValueResponse[] =
      await this.queueService.request<
        GetCollateralValueResponse[],
        GetCollateralValuePayload
      >(GET_COLLATERAL_VALUE_RPC, {
        userId,
      });

    const assetList: AssetList = await this.queueService.request(
      GET_ASSET_INFORMATION_RPC,
    );

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

    this.queueService.publish(COLLATERAL_RECEIVED_TOPIC, {
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
    collateralValue: GetCollateralValueResponse[],
    assetList: AssetList,
  ): number {
    return collateralValue.reduce((sum: number, value: GetCollateralValueResponse) => {
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
