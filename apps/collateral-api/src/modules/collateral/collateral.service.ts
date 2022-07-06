import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
} from '@archie-microservices/api-interfaces/collateral';
import {
  GetAssetPriceResponse,
  GetAssetPricesResponse,
} from '@archie-microservices/api-interfaces/asset_price';
import { InternalApiService } from '@archie-microservices/internal-api';
import { CollateralWithdrawal } from './collateral_withdrawal.entity';
import { UserVaultAccountService } from '../user_vault_account/user_vault_account.service';
import { FireblocksService } from '../fireblocks/fireblocks.service';

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
    private internalApiService: InternalApiService,
    private userVaultAccountService: UserVaultAccountService,
    private fireblocksService: FireblocksService,
  ) {}

  public async createDeposit(
    transactionId: string,
    userId: string,
    asset: string,
    amount: number,
    destinationAddress: string,
    status: TransactionStatus,
  ): Promise<void> {
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
          errorMessage: error.message,
        },
      });

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  public async createWithdrawal({
    userId,
    asset,
    currentAmount,
    withdrawalAmount,
    destinationAddress,
  }: {
    userId: string;
    asset: string;
    currentAmount: number;
    withdrawalAmount: number;
    destinationAddress: string;
  }): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userVaultAccount =
        await this.userVaultAccountService.getUserVaultAccount(userId);
      if (!userVaultAccount) {
        // TODO handle no vault account or something
        return;
      }

      await queryRunner.manager.save(CollateralWithdrawal, {
        userId,
        asset,
        withdrawalAmount,
        currentAmount,
        destinationAddress,
      });

      // Do we want the collateralId here? then we need to change Collateral typedef
      await queryRunner.manager.update(
        Collateral,
        {
          userId,
          asset,
        },
        {
          amount: currentAmount - withdrawalAmount,
        },
      );
      const transaction = await this.fireblocksService.withdrawAsset({
        amount: withdrawalAmount,
        asset,
        destinationAddress,
        vaultAccountId: userVaultAccount.id,
      });
      Logger.log('Created fireblocks transaction', transaction);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      Logger.error({
        code: 'CREATE_WITHDRAWAL_ERROR',
        metadata: {
          userId,
          asset,
          currentAmount,
          withdrawalAmount,
          destinationAddress,
          error: JSON.stringify(error),
          errorMessage: error.message,
        },
      });

      throw new InternalServerErrorException();
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

  // TODO probably move this to a new service?
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

    await this.createWithdrawal({
      currentAmount: availableCollateral.amount,
      withdrawalAmount,
      destinationAddress,
      asset,
      userId,
    });

    return;
  }

  public async getUserWithdrawals(userId: string): Promise<GetUserWithdrawals> {
    return this.collateralWithdrawalRepository.findBy({
      userId,
    });
  }
}
