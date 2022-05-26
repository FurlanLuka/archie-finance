import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'fireblocks-sdk';
import { Connection, Repository } from 'typeorm';
import { Collateral } from './collateral.entity';
import { CollateralDeposit } from './collateral_deposit.entity';

@Injectable()
export class CollateralService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CollateralDeposit)
    private collateralDepositRepository: Repository<CollateralDeposit>,
    private connection: Connection,
  ) {}

  public async createDeposit(
    transactionId: string,
    userId: string,
    asset: string,
    amount: number,
    destinationAddress: string,
    status: TransactionStatus,
  ): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    const collateralDeposit: CollateralDeposit | undefined =
      await this.collateralDepositRepository.findOne({
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
          collateralDeposit === undefined ||
          (collateralDeposit !== undefined &&
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
        },
      });

      throw new InternalServerErrorException();
    }
  }

  private async getNewCollateralRecord(
    userId: string,
    asset: string,
    amount: number,
  ): Promise<Partial<Collateral>> {
    const collateral: Collateral | undefined =
      await this.collateralRepository.findOne({
        userId,
        asset,
      });

    const collateralAmount: number =
      collateral === undefined ? amount : collateral.amount + amount;

    return {
      ...collateral,
      userId,
      asset,
      amount: collateralAmount,
    };
  }

  public async getUserCollateral(userId: string): Promise<Collateral[]> {
    return this.collateralRepository.find({
      userId,
    });
  }
}
