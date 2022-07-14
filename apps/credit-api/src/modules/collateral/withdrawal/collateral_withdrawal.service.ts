import {
  GetCollateralWithdrawal,
  GetUserWithdrawals,
} from '@archie-microservices/api-interfaces/collateral';
import { COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE } from '@archie/api/credit-api/constants';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import { Repository } from 'typeorm';
import { Collateral } from '../collateral.entity';
import { CollateralWithdrawCompletedDto } from './collateral_withdrawal.dto';
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
    private amqpConnection: AmqpConnection,
  ) {}

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
      // TODO something that isn't as fragile
      await this.collateralWithdrawalRepository.update(
        {
          userId,
          asset,
          destinationAddress: destinationAddress,
          transactionId: null,
          status: TransactionStatus.SUBMITTED,
        },
        {
          transactionId,
          status: TransactionStatus.COMPLETED,
        },
      );
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
