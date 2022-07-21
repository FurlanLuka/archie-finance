import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import { DataSource, Repository } from 'typeorm';
import { Collateral } from './collateral.entity';
import { CollateralDeposit } from './collateral_deposit.entity';
import {
  GetCollateralValueResponse,
  GetTotalCollateralValueResponse,
  GetUserCollateral,
  GetUserWithdrawals,
} from '@archie/api/utils/interfaces/collateral';
import {
  GetAssetPriceResponse,
  GetAssetPricesResponse,
} from '@archie/api/utils/interfaces/asset_price';
import { InternalApiService } from '@archie-microservices/internal-api';
import { CollateralWithdrawal } from './collateral_withdrawal.entity';
import {
  DepositCreationInternalError,
  WithdrawalCreationInternalError,
} from './collateral.errors';
import { CreateDepositDto } from './collateral.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE } from '@archie/api/credit-api/constants';

@Injectable()
export class CollateralService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CollateralDeposit)
    private collateralDepositRepository: Repository<CollateralDeposit>,
    @InjectRepository(CollateralWithdrawal)
    private collateralWithdrawalRepository: Repository<CollateralWithdrawal>,
    private dataSource: DataSource,
    private amqpConnection: AmqpConnection,
    private internalApiService: InternalApiService,
  ) {}

  public async createDeposit({
    transactionId,
    userId,
    asset,
    amount,
    destinationAddress,
    status,
  }: CreateDepositDto): Promise<void> {
    Logger.log('COLLATERAL_SERVICE_CREATE_DEPOSIT', {
      transactionId,
      userId,
      asset,
      amount,
      destinationAddress,
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
        destinationAddress,
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
        destinationAddress,
        status,
        error: JSON.stringify(error),
        errorMessage: error.message,
      });
    } finally {
      await queryRunner.release();
    }
  }

  public async createWithdrawal({
    userId,
    asset,
    withdrawalAmount,
    destinationAddress,
    transactionId,
    status,
  }: {
    transactionId: string;
    userId: string;
    asset: string;
    withdrawalAmount: number;
    destinationAddress: string;
    status: TransactionStatus;
  }): Promise<void> {
    Logger.log({
      code: 'COLLATERAL_WITHDRAW_CREATE',
      data: {
        userId,
        asset,
        withdrawalAmount,
        destinationAddress,
        transactionId,
        status,
      },
    });
    try {
      const currentCollateral = await this.collateralRepository.findOneByOrFail(
        {
          userId: userId,
          asset,
        },
      );

      await this.collateralWithdrawalRepository.save({
        userId,
        asset,
        withdrawalAmount,
        currentAmount: currentCollateral.amount,
        destinationAddress: destinationAddress,
        transactionId,
      });

      await this.collateralRepository
        .createQueryBuilder('Collateral')
        .update(Collateral)
        .where('userId = :userId AND asset = :asset', { userId, asset })
        .set({ amount: () => 'amount - :withdrawalAmount' })
        .setParameter('withdrawalAmount', withdrawalAmount)
        .execute();
    } catch (error) {
      throw new WithdrawalCreationInternalError({
        userId,
        asset,
        withdrawalAmount,
        destinationAddress,
        error: JSON.stringify(error),
        errorMessage: error.message,
      });
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

  public async getUserCollateral(userId: string): Promise<GetUserCollateral> {
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

  public async withdrawUserCollateral(
    userId: string,
    asset: string,
    withdrawalAmount: number,
    destinationAddress: string,
  ): Promise<void> {
    const userCollateral: GetUserCollateral = await this.getUserCollateral(
      userId,
    );

    const availableCollateral = userCollateral.find(
      (collateral) => collateral.asset === asset,
    );

    if (availableCollateral === undefined) {
      throw new NotFoundException('No collateral in the desired asset');
    }

    if (availableCollateral.amount < withdrawalAmount) {
      throw new NotFoundException('Not enough amount');
    }

    Logger.log({
      code: 'COLLATERAL_SERVICE_WITHDRAW_INITIALIZED',
      params: {
        asset,
        withdrawalAmount,
        userId,
        destinationAddress,
      },
    });
    this.amqpConnection.publish(
      COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE.name,
      '',
      {
        asset,
        withdrawalAmount,
        userId,
        destinationAddress,
      },
    );
  }

  public async getUserWithdrawals(userId: string): Promise<GetUserWithdrawals> {
    return this.collateralWithdrawalRepository.findBy({
      userId,
    });
  }
}
