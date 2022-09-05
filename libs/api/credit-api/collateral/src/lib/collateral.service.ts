import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import { DataSource, Repository } from 'typeorm';
import { Collateral } from './collateral.entity';
import { CollateralDeposit } from './collateral_deposit.entity';
import {
  GetCollateralValueResponse,
  GetTotalCollateralValueResponse,
  GetCollateralResponse,
} from './collateral.interfaces';
import { DepositCreationInternalError } from './collateral.errors';
import { CreateDepositDto } from './collateral.interfaces';
import { CollateralValueService } from './collateral-value/collateral-value.service';
import { QueueService } from '@archie/api/utils/queue';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { CollateralDepositedPayload } from '@archie/api/collateral-api/data-transfer-objects';

@Injectable()
export class CollateralService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CollateralDeposit)
    private collateralDepositRepository: Repository<CollateralDeposit>,
    private dataSource: DataSource,
    private queueService: QueueService,
    private collateralValueService: CollateralValueService,
  ) {}

  public async createDeposit({
    transactionId,
    userId,
    asset,
    amount,
    destination,
    status,
  }: CollateralDepositedPayload): Promise<void> {
    Logger.log('COLLATERAL_SERVICE_CREATE_DEPOSIT', {
      transactionId,
      userId,
      asset,
      amount,
      destination,
      status,
    });

    const queryRunner = this.dataSource.createQueryRunner();

    const collateralDeposit: CollateralDeposit | null =
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
        destination,
        status,
        amount,
      });

      if (status === TransactionStatus.COMPLETED) {
        if (
          collateralDeposit === null ||
          (collateralDeposit !== null &&
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

      throw new DepositCreationInternalError({
        asset,
        transactionId,
        amount,
        destination,
        status,
        error: JSON.stringify(error),
        errorMessage: error.message,
      });
    } finally {
      await queryRunner.release();
    }
  }

  private async getNewCollateralRecord(
    userId: string,
    asset: string,
    amount: number,
  ): Promise<Partial<Collateral>> {
    const collateral: Collateral | null =
      await this.collateralRepository.findOneBy({
        userId,
        asset,
      });

    const collateralAmount: number =
      collateral === null ? amount : collateral.amount + amount;

    return {
      ...collateral,
      userId,
      asset,
      amount: collateralAmount,
    };
  }

  public async getUserCollateral(
    userId: string,
  ): Promise<GetCollateralResponse[]> {
    const userCollateral: Collateral[] = await this.collateralRepository.findBy(
      {
        userId,
      },
    );

    return userCollateral.map((collateral: Collateral) => ({
      asset: collateral.asset,
      amount: collateral.amount,
    }));
  }

  public async getUserCollateralValue(
    userId: string,
  ): Promise<GetCollateralValueResponse[]> {
    const userCollateral: GetCollateralResponse[] =
      await this.getUserCollateral(userId);

    const assetPrices: GetAssetPriceResponse[] =
      await this.queueService.request(GET_ASSET_PRICES_RPC);

    return this.collateralValueService.getUserCollateralValue(
      userCollateral,
      assetPrices,
    );
  }

  public async getUserTotalCollateralValue(
    userId: string,
  ): Promise<GetTotalCollateralValueResponse> {
    const userCollateralValue: GetCollateralValueResponse[] =
      await this.getUserCollateralValue(userId);

    return {
      value: userCollateralValue.reduce((sum, value) => sum + value.price, 0),
    };
  }
}
