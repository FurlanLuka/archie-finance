import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import {
  DataSource,
  LessThanOrEqual,
  MoreThan,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Collateral } from './collateral.entity';
import { CollateralDeposit } from './collateral_deposit.entity';
import {
  GetCollateralResponse,
  GetCollateralValueResponse,
  GetTotalCollateralValueResponse,
} from './collateral.interfaces';
import { DepositCreationInternalError } from './collateral.errors';
import { CollateralValueService } from './collateral-value/collateral-value.service';
import { QueueService } from '@archie/api/utils/queue';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import {
  CollateralDepositedPayload,
  InternalCollateralTransactionCompletedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';
import {
  COLLATERAL_DEPOSIT_COMPLETED_TOPIC,
  COLLATERAL_LIQUIDATION_INITIATED_TOPIC,
} from '@archie/api/credit-api/constants';
import {
  CollateralDepositCompletedPayload,
  CollateralLiquidationInitiatedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { MarginCallCompletedPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { BigNumber } from 'bignumber.js';

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
          collateralDeposit.status !== TransactionStatus.COMPLETED
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

    if (status === TransactionStatus.COMPLETED) {
      this.queueService.publish<CollateralDepositCompletedPayload>(
        COLLATERAL_DEPOSIT_COMPLETED_TOPIC,
        {
          userId,
          asset,
          amount,
          transactionId,
        },
      );
    }
  }

  private async getNewCollateralRecord(
    userId: string,
    asset: string,
    amount: string,
  ): Promise<Partial<Collateral>> {
    const collateral: Collateral | null =
      await this.collateralRepository.findOneBy({
        userId,
        asset,
      });

    const collateralAmount: string =
      collateral === null
        ? amount
        : BigNumber(collateral.amount).plus(amount).toString(); // TODO: refactor- update to use 1 db txn

    return {
      ...collateral,
      userId,
      asset,
      amount: collateralAmount,
    };
  }

  public async handleInternalTransactionCompletedEvent(
    transaction: InternalCollateralTransactionCompletedPayload,
  ): Promise<void> {
    // TODO: Do not handle same events multiple times
    const updatedResult: UpdateResult =
      await this.collateralRepository.decrement(
        {
          userId: transaction.userId,
          asset: transaction.asset,
          amount: MoreThan(transaction.fee),
        },
        'amount',
        transaction.fee,
      );

    if (updatedResult.affected === 0) {
      await this.collateralRepository.delete({
        userId: transaction.userId,
        asset: transaction.asset,
        amount: LessThanOrEqual(transaction.fee),
      });
    }
  }

  public async liquidateAssets(
    _liquidationAssets: MarginCallCompletedPayload,
  ): Promise<void> {
    // // TODO: Do not handle same events multiple times + check that current collateral balance === balance ltv was calculated on
    // const queryRunner = this.dataSource.createQueryRunner();
    //
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    //
    // try {
    //   await Promise.all(
    //     liquidationAssets.liquidation.map(async (liquidation) => {
    //       await this.collateralRepository.decrement(
    //         {
    //           userId: liquidationAssets.userId,
    //           asset: liquidation.asset,
    //         },
    //         'amount',
    //         liquidation.amount,
    //       );
    //     }),
    //   );
    //
    //   await this.collateralRepository.delete({
    //     userId: liquidationAssets.userId,
    //     amount: '0',
    //   });
    //   await queryRunner.commitTransaction();
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //
    //   throw error;
    // } finally {
    //   await queryRunner.release();
    // }
    //
    // this.queueService.publish<CollateralLiquidationInitiatedPayload>(
    //   COLLATERAL_LIQUIDATION_INITIATED_TOPIC,
    //   {
    //     userId: liquidationAssets.userId,
    //     collateral: liquidationAssets.liquidation,
    //   },
    // );
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
