import { LiquidationLog } from '../../liquidation_logs.entity';
import {
  CollateralValue,
  GetCollateralValueResponse,
} from '@archie-microservices/api-interfaces/collateral';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MarginCall } from '../../margin_calls.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MarginLiquidationService {
  constructor(
    @InjectRepository(LiquidationLog)
    private liquidationLogsRepository: Repository<LiquidationLog>,
  ) {}

  public async liquidateAssets(
    userId: string,
    assetsToLiquidate: Partial<LiquidationLog>[],
  ): Promise<void> {
    // TODO: update collateral amount once collateral entity is moved
    await this.liquidationLogsRepository.save(assetsToLiquidate);
  }

  public async getAssetsToLiquidate(
    userId: string,
    amount: number,
    collateralAssets: GetCollateralValueResponse,
    marginCall: MarginCall,
  ): Promise<Partial<LiquidationLog>[]> {
    const sortedCollateralAssetsByAllocation: GetCollateralValueResponse =
      collateralAssets
        .slice()
        .sort((a: CollateralValue, b: CollateralValue) =>
          a.price >= b.price ? -1 : 1,
        );

    let targetLiquidationAmount: number = amount;

    return sortedCollateralAssetsByAllocation
      .map((collateralValue): Partial<LiquidationLog> => {
        if (targetLiquidationAmount > 0) {
          let newCollateralAssetPrice: number =
            collateralValue.price - targetLiquidationAmount;

          if (newCollateralAssetPrice >= 0) {
            const amountToTake: number =
              collateralValue.price - newCollateralAssetPrice;
            targetLiquidationAmount -= amountToTake;
          } else {
            newCollateralAssetPrice = 0;
            targetLiquidationAmount -= collateralValue.price;
          }

          const assetAmountPerUnit: number =
            collateralValue.price / collateralValue.assetAmount;
          const newCollateralAssetAmount: number =
            newCollateralAssetPrice / assetAmountPerUnit;

          return {
            asset: collateralValue.asset,
            amount: collateralValue.assetAmount - newCollateralAssetAmount,
            userId,
            marginCall: marginCall,
            price: collateralValue.price - newCollateralAssetPrice,
          };
        }

        return {
          asset: collateralValue.asset,
          amount: 0,
          userId,
          marginCall: marginCall,
          price: 0,
        };
      })
      .filter((liquidatedAsset) => liquidatedAsset.amount > 0);
  }
}
