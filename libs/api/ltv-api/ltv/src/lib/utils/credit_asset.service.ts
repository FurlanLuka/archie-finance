import { Injectable } from '@nestjs/common';
import { LtvCollateral } from '../collateral.entity';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import { LtvCredit } from '../credit.entity';
import { CreditNotSetUpError } from '../lib.errors';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  CreditAssets,
  CreditPerUser,
  MultipleCreditAssets,
} from './utils.interfaces';
import { QueueService } from '@archie/api/utils/queue';

@Injectable()
export class CreditAssetUtilService {
  constructor(
    @InjectRepository(LtvCredit)
    private ltvCreditRepository: Repository<LtvCredit>,
    @InjectRepository(LtvCollateral)
    private ltvCollateralRepository: Repository<LtvCollateral>,
    private queueService: QueueService,
  ) {}

  public async getCreditInfo(userId: string): Promise<CreditAssets> {
    const credit: LtvCredit | null = await this.ltvCreditRepository.findOneBy({
      userId,
    });
    if (credit === null) {
      throw new CreditNotSetUpError();
    }

    const collateral: LtvCollateral[] =
      await this.ltvCollateralRepository.findBy({
        userId,
      });

    const assetPrices: GetAssetPriceResponse[] =
      await this.queueService.request(GET_ASSET_PRICES_RPC);

    return {
      credit,
      collateral,
      assetPrices,
    };
  }

  public async getCreditForMultipleUsers(
    userIds: string[],
  ): Promise<MultipleCreditAssets> {
    const credits: LtvCredit[] = await this.ltvCreditRepository.findBy({
      userId: In(userIds),
    });
    const collateral: LtvCollateral[] =
      await this.ltvCollateralRepository.findBy({
        userId: In(userIds),
      });

    const foundUserIds: string[] = credits.map(
      (credit: LtvCredit) => credit.userId,
    );

    const assetPrices: GetAssetPriceResponse[] =
      await this.queueService.request(GET_ASSET_PRICES_RPC);

    const creditPerUser: CreditPerUser[] = foundUserIds.map(
      (userId: string) => {
        const usersCredit: LtvCredit | undefined = credits.find(
          (credit) => credit.userId === userId,
        );

        const usersCollateral: LtvCollateral[] = collateral.filter(
          (c) => c.userId === userId,
        );

        return {
          credit: <LtvCredit>usersCredit,
          collateral: usersCollateral,
        };
      },
    );

    return {
      creditPerUser: creditPerUser,
      assetPrices,
    };
  }
}
