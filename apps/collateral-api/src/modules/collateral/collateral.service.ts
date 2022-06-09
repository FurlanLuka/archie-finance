import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import { Connection, Repository } from 'typeorm';
import { Collateral } from './collateral.entity';
import { CollateralDeposit } from './collateral_deposit.entity';
import {
  GetCollateralValueResponse,
  GetTotalCollateralValueResponse,
  GetUserCollateral,
} from '@archie-microservices/api-interfaces/collateral';
import {
  GetAssetPriceResponse,
  GetAssetPricesResponse,
} from '@archie-microservices/api-interfaces/asset_price';
import { InternalApiService } from '@archie-microservices/internal-api';

@Injectable()
export class CollateralService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CollateralDeposit)
    private collateralDepositRepository: Repository<CollateralDeposit>,
    private connection: Connection,
    private internalApiService: InternalApiService,
  ) {}

  public async createDeposit(
    transactionId: string,
    userId: string,
    asset: string,
    amount: number,
    destinationAddress: string,
    status: TransactionStatus,
  ): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    const collateralDeposit: CollateralDeposit | undefined =
      await this.collateralDepositRepository.findOneBy({
        transactionId,
      });

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(CollateralDeposit, {
        transactionId,
        userId,
        asset,
        destinationAddress,
        status,
        amount,
      });

      if (status === TransactionStatus.COMPLETED) {
        if (
          collateralDeposit === undefined ||
          (collateralDeposit !== undefined &&
            collateralDeposit.status !== TransactionStatus.COMPLETED)
        ) {
          const collateralRecord: Partial<Collateral> =
            await this.getNewCollateralRecord(userId, asset, amount);

          await queryRunner.manager.save(Collateral, collateralRecord);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      Logger.error({
        code: 'CREATE_DEPOSIT_ERROR',
        metadata: {
          userId,
          asset,
          transactionId,
          amount,
          destinationAddress,
          status,
          error: JSON.stringify(error),
        },
      });

      throw new InternalServerErrorException();
    }
  }

  private async getNewCollateralRecord(
    userId: string,
    asset: string,
    amount: number,
  ): Promise<Partial<Collateral>> {
    const collateral: Collateral | undefined =
      await this.collateralRepository.findOneBy({
        userId,
        asset,
      });

    const collateralAmount: number =
      collateral === undefined ? amount : collateral.amount + amount;

    return {
      ...collateral,
      userId,
      asset,
      amount: collateralAmount,
    };
  }

  public async getUserCollateral(userId: string): Promise<GetUserCollateral> {
    const userCollateral: Collateral[] = await this.collateralRepository.findBy({
      userId,
    });

    return userCollateral.map((collateral: Collateral) => ({
      asset: collateral.asset,
      amount: collateral.amount,
    }));
  }

  public async getUserCollateralValue(
    userId: string,
  ): Promise<GetCollateralValueResponse> {
    const userCollateral: GetUserCollateral = await this.getUserCollateral(
      userId,
    );

    const assetPrices: GetAssetPricesResponse =
      await this.internalApiService.getAssetPrices();

    return userCollateral.map((collateral: Collateral) => {
      const assetPrice: GetAssetPriceResponse | undefined = assetPrices.find(
        (asset) => asset.asset === collateral.asset,
      );

      if (assetPrice === undefined) {
        return {
          asset: collateral.asset,
          assetAmount: collateral.amount,
          price: 0,
        };
      }

      return {
        asset: collateral.asset,
        assetAmount: collateral.amount,
        price: collateral.amount * assetPrice.price,
      };
    });
  }

  public async getUserTotalCollateralValue(
    userId: string,
  ): Promise<GetTotalCollateralValueResponse> {
    const userCollateralValue: GetCollateralValueResponse =
      await this.getUserCollateralValue(userId);

    return {
      value: userCollateralValue.reduce((sum, value) => sum + value.price, 0),
    };
  }
}
