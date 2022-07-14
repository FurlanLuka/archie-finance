import {
  GetCollateralWithdrawal,
  GetUserWithdrawalAmount,
  GetUserWithdrawals,
} from '@archie-microservices/api-interfaces/collateral';
import { InternalApiService } from '@archie-microservices/internal-api';
import { COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE } from '@archie/api/credit-api/constants';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import { Repository } from 'typeorm';
import { Credit } from '../../credit/credit.entity';
import { LiquidationLog } from '../../margin/liquidation_logs.entity';
import { MarginLtvService } from '../../margin/ltv/margin_ltv.service';
import { UsersLtv } from '../../margin/margin.interfaces';
import { Collateral } from '../collateral.entity';
import {
  CollateralWithdrawCompletedDto,
  CollateralWithdrawTransactionCreatedDto,
} from './collateral_withdrawal.dto';
import { CollateralWithdrawal } from './collateral_withdrawal.entity';
import {
  WithdrawalCreationInternalError,
  WithdrawalInitializeInternalError,
} from './collateral_withdrawal.errors';

@Injectable()
export class CollateralWithdrawalService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CollateralWithdrawal)
    private collateralWithdrawalRepository: Repository<CollateralWithdrawal>,
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    @InjectRepository(LiquidationLog)
    private liquidationLogsRepository: Repository<LiquidationLog>,
    private marginLtvService: MarginLtvService,
    // private internalApiService: InternalApiService,
    private amqpConnection: AmqpConnection,
  ) {}

  public async handleWithdrawalTransactionCreated({
    withdrawalId,
    transactionId,
  }: CollateralWithdrawTransactionCreatedDto): Promise<void> {
    Logger.log({
      code: 'COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE',
      params: {
        withdrawalId,
        transactionId,
      },
    });
    await this.collateralWithdrawalRepository.update(
      {
        id: withdrawalId,
      },
      {
        transactionId,
      },
    );
  }

  public async handleWithdrawalComplete({
    userId,
    asset,
    destinationAddress,
    transactionId,
    status,
  }: CollateralWithdrawCompletedDto): Promise<void> {
    Logger.log({
      code: 'COLLATERAL_WITHDRAW_COMPLETE',
      params: {
        userId,
        asset,
        destinationAddress,
        transactionId,
        status,
      },
    });
    try {
      const updateResult = await this.collateralWithdrawalRepository.update(
        {
          transactionId,
        },
        {
          status: TransactionStatus.COMPLETED,
        },
      );

      if (updateResult.affected === 0) {
        Logger.log({
          code: 'COLLATERAL_WITHDRAW_COMPLETE_NO_TRANSACTION',
          message: 'transactionId not yet synced',
          params: {
            userId,
            asset,
            destinationAddress,
            transactionId,
            status,
          },
        });
        throw new NotFoundException();
      }
    } catch (error) {
      throw new WithdrawalCreationInternalError({
        userId,
        asset,
        destinationAddress,
        error: JSON.stringify(error),
        errorMessage: error.message,
      });
    }
  }

  public async getUserMaxWithdrawalAmount(
    userId: string,
    asset: string,
  ): Promise<GetUserWithdrawalAmount> {
    const credit = await this.creditRepository.findOneBy({
      userId,
    });

    const liquidationLogs = await this.liquidationLogsRepository.findBy({
      userId,
    });

    const collaterals = await this.collateralRepository.findBy({
      userId,
    });

    //  const assetPrices = await this.internalApiService.getAssetPrices();
    const assetPrices = [
      {
        asset: 'BTC',
        price: 19731.44,
        currency: 'USD',
      },
      {
        asset: 'ETH',
        price: 1080.76,
        currency: 'USD',
      },
      {
        asset: 'SOL',
        price: 33.78,
        currency: 'USD',
      },
      {
        asset: 'USDC',
        price: 1.003,
        currency: 'USD',
      },
    ];

    const userLtv = this.marginLtvService.calculateUsersLtv(
      userId,
      [credit],
      liquidationLogs,
      collaterals,
      assetPrices,
    );
    console.log('juzr ltv', userLtv);

    return { maxAmount: 0 };
  }

  public async withdrawUserCollateral(
    userId: string,
    asset: string,
    withdrawalAmount: number,
    destinationAddress: string,
  ): Promise<GetCollateralWithdrawal> {
    try {
      const userCollateral = await this.collateralRepository.findOneBy({
        userId,
        asset,
      });

      if (!userCollateral) {
        throw new NotFoundException('No collateral in the desired asset');
      }

      if (userCollateral.amount < withdrawalAmount) {
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

      const withdrawal = await this.collateralWithdrawalRepository.save({
        userId,
        asset,
        withdrawalAmount,
        currentAmount: userCollateral.amount,
        destinationAddress: destinationAddress,
        transactionId: null,
        status: TransactionStatus.SUBMITTED,
      });

      await this.collateralRepository
        .createQueryBuilder('Collateral')
        .update(Collateral)
        .where('userId = :userId AND asset = :asset', { userId, asset })
        .set({ amount: () => 'amount - :withdrawalAmount' })
        .setParameter('withdrawalAmount', withdrawalAmount)
        .execute();

      this.amqpConnection.publish(
        COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE.name,
        '',
        {
          asset,
          withdrawalAmount,
          userId,
          destinationAddress,
          withdrawalId: withdrawal.id,
        },
      );

      return withdrawal;
    } catch (error) {
      throw new WithdrawalInitializeInternalError({
        userId,
        asset,
        withdrawalAmount,
        destinationAddress,
        error: JSON.stringify(error),
        errorMessage: error.message,
      });
    }
  }

  public async getUserWithdrawals(userId: string): Promise<GetUserWithdrawals> {
    return this.collateralWithdrawalRepository.findBy({
      userId,
    });
  }
}
