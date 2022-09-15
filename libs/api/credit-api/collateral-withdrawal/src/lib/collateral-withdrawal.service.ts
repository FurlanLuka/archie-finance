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
import { DataSource, Repository } from 'typeorm';
import {
  GetCollateralWithdrawalResponse,
  GetUserMaxWithdrawalAmountResponse,
} from './collateral-withdrawal.interfaces';
import { CollateralWithdrawal } from './collateral-withdrawal.entity';
import {
  CollateralNotFoundError,
  WithdrawalCreationInternalError,
  WithdrawalInitializeInternalError,
} from './collateral-withdrawal.errors';
import {
  Collateral,
  CollateralValueService,
  GetCollateralValueResponse,
} from '@archie/api/credit-api/collateral';
import { QueueService } from '@archie/api/utils/queue';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';
import { CollateralWithdrawInitializedPayload } from '@archie/api/credit-api/data-transfer-objects';
import {
  CollateralWithdrawCompletedPayload,
  CollateralWithdrawTransactionCreatedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';
import {
  GetLoanBalancesPayload,
  GetLoanBalancesResponse,
} from '@archie/api/peach-api/data-transfer-objects';
import { GET_LOAN_BALANCES_RPC } from '@archie/api/peach-api/constants';

const MAX_LTV = 0.3;
@Injectable()
export class CollateralWithdrawalService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CollateralWithdrawal)
    private collateralWithdrawalRepository: Repository<CollateralWithdrawal>,
    private collateralValueService: CollateralValueService,
    private queueService: QueueService,
    private dataSource: DataSource,
  ) {}

  public async handleWithdrawalTransactionCreated({
    withdrawalId,
    transactionId,
  }: CollateralWithdrawTransactionCreatedPayload): Promise<void> {
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
    fee,
  }: CollateralWithdrawCompletedPayload): Promise<void> {
    Logger.log({
      code: 'COLLATERAL_WITHDRAW_COMPLETE',
      params: {
        userId,
        asset,
        transactionId,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.collateralRepository.decrement(
        {
          asset,
          userId,
        },
        'amount',
        fee,
      );
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
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) {
        throw error;
      }
      throw new WithdrawalCreationInternalError({
        userId,
        asset,
        error: JSON.stringify(error),
        errorMessage: error.message,
      });
    } finally {
      await queryRunner.release();
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
    const userCollateral = await this.collateralRepository.findBy({ userId });

    const collateralValue = this.collateralValueService.getUserCollateralValue(
      userCollateral,
      assetPrices,
    );

    const desiredAsset = collateralValue.find((c) => c.asset === asset);

    // early break if user isn't hodling the desired asset at all
    if (!desiredAsset) {
      return { maxAmount: 0 };
    }

    const credit = await this.queueService.request<
      GetLoanBalancesResponse,
      GetLoanBalancesPayload
    >(GET_LOAN_BALANCES_RPC, {
      userId,
    });

    const totalCollateralValue: number = collateralValue.reduce(
      (value: number, collateralAsset: GetCollateralValueResponse) =>
        value + collateralAsset.price,
      0,
    );

    const maxAmountForMaxLtv = credit.utilizationAmount / MAX_LTV;
    const maxAvailableAmount = Math.max(
      totalCollateralValue - maxAmountForMaxLtv,
      0,
    );

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
      const userCollateral: Collateral | null =
        await this.collateralRepository.findOneBy({
          userId,
          asset,
        });

      const { maxAmount } = await this.getUserMaxWithdrawalAmount(
        userId,
        asset,
      );

      if (userCollateral === null) throw new CollateralNotFoundError();

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

      const updatedCollateral: Collateral | undefined =
        await this.collateralRepository
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
            return (<Collateral[]>response.raw)[0];
          });

      if (updatedCollateral !== undefined && updatedCollateral.amount == 0) {
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
