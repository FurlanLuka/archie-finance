import { Injectable } from '@nestjs/common';
import { LtvCollateral } from '../collateral.entity';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';
import { LtvCredit } from '../credit.entity';
import { CreditNotSetUpError } from '../lib.errors';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditAssets } from './utils.interfaces';
import { QueueService } from '@archie/api/utils/queue';

@Injectable()
export class CreditAssetUtilService {
  constructor(
    @InjectRepository(LtvCredit)
    private ltvCreditRepository: Repository<LtvCredit>,
    @InjectRepository(LtvCredit)
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
}
