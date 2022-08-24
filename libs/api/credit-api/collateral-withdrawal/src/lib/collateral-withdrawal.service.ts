import { COLLATERAL_WITHDRAW_INITIALIZED_TOPIC } from '@archie/api/credit-api/constants';
import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import { Repository } from 'typeorm';
import {
  CollateralWithdrawCompletedDto,
  CollateralWithdrawTransactionCreatedDto,
  GetCollateralWithdrawalResponse,
  GetUserMaxWithdrawalAmountResponse,
} from './collateral-withdrawal.interfaces';
import { CollateralWithdrawal } from './collateral-withdrawal.entity';
import {
  WithdrawalCreationInternalError,
  WithdrawalInitializeInternalError,
} from './collateral-withdrawal.errors';
import { Collateral } from '@archie/api/credit-api/collateral';
import { Credit } from '@archie/api/credit-api/credit';
import {
  LiquidationLog,
  MarginLtvService,
} from '@archie/api/credit-api/margin';
import { QueueService } from '@archie/api/utils/queue';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';
import { CollateralWithdrawInitializedPayload } from '@archie/api/credit-api/data-transfer-objects';

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
    private queueService: QueueService,
  ) {}

  public async handleWithdrawalTransactionCreated({
    withdrawalId,
    transactionId,
  }: CollateralWithdrawTransactionCreatedDto): Promise<void> {
    Logger.log({
      code: 'COLLATERAL_WITHDRAW_TRANSACTION_CREATED_TOPIC',
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
    transactionId,
  }: CollateralWithdrawCompletedDto): Promise<void> {
    Logger.log({
      code: 'COLLATERAL_WITHDRAW_COMPLETE',
      params: {
        userId,
        asset,
        transactionId,
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
            transactionId,
          },
        });
        throw new NotFoundException();
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new WithdrawalCreationInternalError({
        userId,
        asset,
        error: JSON.stringify(error),
        errorMessage: error.message,
      });
    }
  }

  public async getUserMaxWithdrawalAmount(
    userId: string,
    asset: string,
  ): Promise<GetUserMaxWithdrawalAmountResponse> {
    const assetPrices: GetAssetPriceResponse[] =
      await this.queueService.request(GET_ASSET_PRICES_RPC);

    const assetPrice = assetPrices.find((a) => a.asset === asset);

    if (!assetPrice) {
      Logger.error({
        code: 'USER_MAX_WITHDRAWAL_ERROR',
        message: `No asset price information for asset ${asset}`,
        assetPrices,
      });

      throw new BadRequestException();
    }

    const collaterals = await this.collateralRepository.findBy({
      userId,
    });

    // early break if user isn't hodling the desired asset at all
    if (!collaterals.find((collateral) => collateral.asset === asset)) {
      return { maxAmount: 0 };
    }

    const credit = await this.creditRepository.findOneBy({
      userId,
    });

    const liquidationLogs = await this.liquidationLogsRepository.findBy({
      userId,
    });

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

    // This isn't going to be undefined, since we did the check above, but it's a different variable here
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
  ): Promise<GetCollateralWithdrawalResponse> {
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

      const updatedCollateral = await this.collateralRepository
        .createQueryBuilder('Collateral')
        .update(Collateral)
        .where(
          'userId = :userId AND asset = :asset AND amount >= :withdrawalAmount',
          { userId, asset, withdrawalAmount },
        )
        .set({ amount: () => 'amount - :withdrawalAmount' })
        .setParameter('withdrawalAmount', withdrawalAmount)
        .returning('*')
        .execute()
        .then((response) => {
          return response.raw[0];
        });

      if (updatedCollateral?.id && updatedCollateral?.amount == 0) {
        await this.collateralRepository.delete({
          id: updatedCollateral.id,
          amount: 0,
        });
      }

      this.queueService.publish<CollateralWithdrawInitializedPayload>(
        COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
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
      if (error instanceof HttpException) {
        throw error;
      }
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

  public async getUserWithdrawals(
    userId: string,
  ): Promise<GetCollateralWithdrawalResponse[]> {
    return this.collateralWithdrawalRepository.findBy({
      userId,
    });
  }
}
