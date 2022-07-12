import { LiquidationLog } from '../../liquidation_logs.entity';
import {
  CollateralValue,
  GetCollateralValueResponse,
} from '@archie-microservices/api-interfaces/collateral';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { MarginCall } from '../../margin_calls.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Collateral } from '../../../collateral/collateral.entity';

@Injectable()
export class MarginLiquidationService {
  constructor(
    @InjectRepository(LiquidationLog)
    private liquidationLogsRepository: Repository<LiquidationLog>,
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    private dataSource: DataSource,
  ) {}

  public async liquidateAssets(
    userId: string,
    assetsToLiquidate: Partial<LiquidationLog>[],
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all(
        assetsToLiquidate.map(async (liquidatedAsset) => {
          const updatedCollateral: UpdateResult =
            await this.collateralRepository
              .createQueryBuilder('Collateral')
              .update(Collateral)
              .where(
                'userId = :userId AND asset = :asset AND amount >= :withdrawalAmount',
                {
                  userId,
                  asset: liquidatedAsset.asset,
                  withdrawalAmount: liquidatedAsset.amount,
                },
              )
              .set({ amount: () => 'amount - :withdrawalAmount' })
              .setParameter('withdrawalAmount', liquidatedAsset.amount)
              .useTransaction(true)
              .execute();

          if (updatedCollateral.affected === 0) {
            throw new InternalServerErrorException({
              userId,
              error: 'Unable to subtract users collateral',
              asset: liquidatedAsset.asset,
              amount: liquidatedAsset.amount,
            });
          }
        }),
      );

      await this.liquidationLogsRepository.save(assetsToLiquidate);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      Logger.error({
        userId,
        errorMessage: 'Error updating user collateral',
        error: error,
      });
      throw new InternalServerErrorException('Error updating user collateral');
    } finally {
      await queryRunner.release();
    }
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

          const assetPricePerUnit: number =
            collateralValue.price / collateralValue.assetAmount;

          const newCollateralAssetAmount: number =
            newCollateralAssetPrice / assetPricePerUnit;

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
