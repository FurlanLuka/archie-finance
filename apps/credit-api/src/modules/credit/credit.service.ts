import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './credit.entity';
import { GetCreditResponse } from './credit.interfaces';
import { ConfigService } from '@archie-microservices/config';
import { AssetList, ConfigVariables, AssetInformation } from '../../interfaces';

@Injectable()
export class CreditService {
  private MINIMUM_CREDIT: number = 200;
  private MAXIMUM_CREDIT: number = 2000;

  constructor(
    private collateralService: CollateralService,
    private configService: ConfigService,
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
  ) {}

  public async createCredit(userId: string): Promise<void> {
    const creditRecord: Credit = await this.creditRepository.findOne({
      userId,
    });

    if (creditRecord) {
      return;
    }

    const collateralValue: GetCollateralValueResponse =
      await this.collateralService.getUserCollateralValue(userId);

    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    let totalCollateralValue: number = collateralValue.reduce(
      (sum: number, value: CollateralValue) => {
        if (!(value.asset in assetList)) {
          return sum;
        }

        const assetInformation: AssetInformation = assetList[value.asset];

        const actualCollateralValue: number =
          (value.price / 100) * assetInformation.ltv;

        return sum + actualCollateralValue;
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

      throw new BadRequestException(
        'ERR_CREATE_CREDIT_MINIMUM_COLLATERAL',
        `Collateralized assets must be worth at least ${this.MINIMUM_CREDIT} USD`,
      );
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

    await this.creditRepository.save({
      userId,
      totalCredit: totalCollateralValue,
      availableCredit: totalCollateralValue,
    });
  }

  public async getCredit(userId: string): Promise<GetCreditResponse> {
    const credit: Credit | undefined = await this.creditRepository.findOne({
      userId,
    });

    if (credit === undefined) {
      throw new NotFoundException();
    }

    return {
      availableCredit: credit.availableCredit,
      totalCredit: credit.totalCredit,
    };
  }
}