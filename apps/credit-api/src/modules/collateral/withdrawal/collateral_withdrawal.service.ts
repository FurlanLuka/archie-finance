import { GetUserWithdrawals } from '@archie-microservices/api-interfaces/collateral';
import { COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE } from '@archie/api/credit-api/constants';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import { Repository } from 'typeorm';
import { Collateral } from '../collateral.entity';
import { CollateralService } from '../collateral.service';
import { CollateralWithdrawal } from './collateral_withdrawal.entity';
import { WithdrawalCreationInternalError } from './collateral_withdrawal.errors';

@Injectable()
export class CollateralWithdrawalService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CollateralWithdrawal)
    private collateralWithdrawalRepository: Repository<CollateralWithdrawal>,
    private collateralService: CollateralService,
    private amqpConnection: AmqpConnection,
  ) {}

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

  public async withdrawUserCollateral(
    userId: string,
    asset: string,
    withdrawalAmount: number,
    destinationAddress: string,
  ): Promise<void> {
    const userCollateral = await this.collateralService.getUserCollateral(
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
