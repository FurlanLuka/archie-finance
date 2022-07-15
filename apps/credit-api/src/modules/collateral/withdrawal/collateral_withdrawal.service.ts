import {
  GetCollateralWithdrawal,
  GetUserWithdrawalAmount,
  GetUserWithdrawals,
} from '@archie-microservices/api-interfaces/collateral';
import { InternalApiService } from '@archie-microservices/internal-api';
import { COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE } from '@archie/api/credit-api/constants';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import { Repository } from 'typeorm';
import { Credit } from '../../credit/credit.entity';
import { LiquidationLog } from '../../margin/liquidation_logs.entity';
import { MarginLtvService } from '../../margin/ltv/margin_ltv.service';
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

const MAX_LTV = 30;
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
    private internalApiService: InternalApiService,
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

    const assetPrices = await this.internalApiService.getAssetPrices();

    const assetPrice = assetPrices.find((a) => a.asset === asset);

    if (!assetPrice) {
      Logger.error({
        code: 'USER_MAX_WITHDRAWAL_ERROR',
        message: `No asset price information for asset ${asset}`,
        assetPrices,
      });

      throw new NotFoundException();
    }

    const { collateralAllocation, collateralBalance, ltv, loanedBalance } =
      this.marginLtvService.calculateUsersLtv(
        userId,
        [credit],
        liquidationLogs,
        collaterals,
        assetPrices,
      );
    Logger.log({
      code: 'COLLATERAL_WITHDRAW_MAXIMUM_AMOUNT',
      message: `Info for user ${userId}`,
      collateralAllocation,
      collateralBalance,
      ltv,
      loanedBalance,
    });

    const desiredAsset = collateralAllocation.find(
      (collateral) => collateral.asset === asset,
    );
    if (!desiredAsset) {
      return { maxAmount: 0 };
    }

    // user has loaned too much
    if (ltv > MAX_LTV) {
      return { maxAmount: 0 };
    }

    // user hasn't loaned any money, they can withdraw everything
    // can any of these be true without the other?
    if (loanedBalance === 0 && ltv === 0) {
      return { maxAmount: desiredAsset.assetAmount };
    }

    const maxAmountForMaxLtv = loanedBalance / (MAX_LTV / 100); // ltv is multiplied by 100 initially
    const maxAvailableAmount = collateralBalance - maxAmountForMaxLtv;

    return {
      maxAmount:
        Math.min(maxAvailableAmount, desiredAsset.price) / assetPrice.price,
    };
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
      const { maxAmount } = await this.getUserMaxWithdrawalAmount(
        userId,
        asset,
      );

      if (maxAmount < withdrawalAmount) {
        throw new BadRequestException({
          code: 'COLLATERAL_WITHDRAW_AMOUNT_ERROR',
          message: 'Not enough amount',
        });
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
