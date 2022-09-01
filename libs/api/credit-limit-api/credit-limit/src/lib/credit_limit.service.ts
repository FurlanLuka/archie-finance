import { Injectable, Logger } from '@nestjs/common';
import {
  CollateralWithdrawInitializedDto,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/fireblocks';
import {
  CollateralDepositCompletedPayload,
  CollateralReceivedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { Collateral } from './collateral.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetCollateralValuePayload,
  GetCollateralValueResponse,
} from '@archie/api/credit-api/collateral';
import {
  AssetInformation,
  AssetList,
} from '@archie/api/collateral-api/asset-information';
import { QueueService } from '@archie/api/utils/queue';
import {
  COLLATERAL_RECEIVED_TOPIC,
  GET_COLLATERAL_VALUE_RPC,
} from '@archie/api/credit-api/constants';
import { GET_ASSET_INFORMATION_RPC } from '@archie/api/collateral-api/constants';
import { CreateCreditMinimumCollateralError } from './credit_limit.errors';

@Injectable()
export class CreditLimitService {
  private MINIMUM_CREDIT = 200;
  private MAXIMUM_CREDIT = 2000;

  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    private queueService: QueueService,
  ) {}

  public async handleCollateralWithdrawInitializedEvent(
    transaction: CollateralWithdrawInitializedDto,
  ): Promise<void> {
    // Get previous collateral check

    await this.collateralRepository
      .createQueryBuilder('Collateral')
      .update(Collateral)
      .where('userId =: userId AND asset =: asset', {
        userId: transaction.userId,
        asset: transaction.asset,
      })
      .set({
        amount: () => '"amount" -: amount',
      })
      .setParameter('amount', transaction.withdrawalAmount)
      .execute();

    // Check if collateral value changed by 10 % - if yes publish credit limit updated event
  }

  public async handleCollateralDepositCompletedEvent(
    transaction: CollateralDepositCompletedPayload,
  ): Promise<void> {
    await this.collateralRepository
      .createQueryBuilder('Collateral')
      .update(Collateral)
      .where('userId =: userId AND asset =: asset', {
        userId: transaction.userId,
        asset: transaction.asset,
      })
      .set({
        amount: () => '"amount" +: amount',
      })
      .setParameter('amount', transaction.amount)
      .execute();

    // Check if collateral value changed by 10 % - if yes publish credit limit updated event
  }

  public async handleInternalTransactionCreatedEvent(
    transaction: InternalCollateralTransactionCreatedPayload,
  ): Promise<void> {
    await this.collateralRepository
      .createQueryBuilder('Collateral')
      .update(Collateral)
      .where('userId =: userId AND asset =: asset', {
        userId: transaction.userId,
        asset: transaction.asset,
      })
      .set({
        amount: () => '"amount" -: amount',
      })
      .setParameter('amount', transaction.amount)
      .execute();

    // Check if collateral value changed by 10 % - if yes publish credit limit updated event}
  }

  public async createCredit(userId: string): Promise<void> {
    // TODO check if already exists
    const collateralValue: GetCollateralValueResponse[] =
      await this.queueService.request<
        GetCollateralValueResponse[],
        GetCollateralValuePayload
      >(GET_COLLATERAL_VALUE_RPC, {
        userId,
      });

    const assetList: AssetList = await this.queueService.request(
      GET_ASSET_INFORMATION_RPC,
    );

    let totalCollateralValue: number = this.getCreditLimit(
      collateralValue,
      assetList,
    );

    if (totalCollateralValue < this.MINIMUM_CREDIT) {
      throw new CreateCreditMinimumCollateralError(this.MINIMUM_CREDIT);
    }

    if (totalCollateralValue > this.MAXIMUM_CREDIT) {
      Logger.warn({
        code: 'CREATE_CREDIT_MAXIMUM_COLLATERAL_VALUE_EXCEEDED',
        metadata: {
          userId,
        },
      });

      totalCollateralValue = this.MAXIMUM_CREDIT;
    }

    // create limit entity and then publish

    this.queueService.publish<CollateralReceivedPayload>(
      COLLATERAL_RECEIVED_TOPIC,
      {
        userId,
      },
    );
  }

  public getCreditLimit(
    collateralValue: GetCollateralValueResponse[],
    assetList: AssetList,
  ): number {
    return collateralValue.reduce(
      (sum: number, value: GetCollateralValueResponse) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (assetList[value.asset] === undefined) {
          return sum;
        }

        const assetInformation: AssetInformation = assetList[value.asset];

        const actualCollateralValue: number =
          (value.price / 100) * assetInformation.ltv;

        return sum + Math.floor(actualCollateralValue);
      },
      0,
    );
  }
}
