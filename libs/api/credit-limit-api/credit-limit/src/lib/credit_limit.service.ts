import { Injectable } from '@nestjs/common';
import {
  CollateralWithdrawInitializedDto,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/fireblocks';
import { CollateralDepositCompletedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { Collateral } from './collateral.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditLimit } from './credit_limit.entity';
import { CollateralValueUtilService } from './utils/collateral_value.service';
import { MathUtilService } from './utils/math.service';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import {
  CollateralValue,
  CollateralWithCalculationDate,
  CollateralWithPrice,
} from './utils/utils.interfaces';
import { AssetInformation } from '@archie/api/collateral-api/asset-information';
import { CREDIT_LIMIT_INCREASED_TOPIC } from '@archie/api/credit-limit-api/constants';

@Injectable()
export class CreditLimitService {
  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(CreditLimit)
    private creditLimitRepository: Repository<CreditLimit>,
    private collateralValueUtilService: CollateralValueUtilService,
    private mathUtilService: MathUtilService,
    private queueService: QueueService,
  ) {}

  public async handleCollateralWithdrawInitializedEvent(
    transaction: CollateralWithdrawInitializedDto,
  ): Promise<void> {
    // TODO: Store transaction ids - no duplicated events

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

    const creditLimit: CreditLimit | null =
      await this.creditLimitRepository.findOneBy({
        userId: transaction.userId,
      });

    if (creditLimit === null) {
      // Do nothing as initial funding was not completed yet
    } else {
      const assetPrices: GetAssetPriceResponse[] =
        await this.queueService.request(GET_ASSET_PRICES_RPC);

      // const collateral: Collateral[] = await this.collateralRepository.findBy({
      //   userId: transaction.userId,
      // });
      const collateral: CollateralWithCalculationDate[] =
        await this.collateralRepository
          .createQueryBuilder('Collateral')
          .select('*, now() as "calculatedAt"')
          .where('userId =: userId', {
            userId: transaction.userId,
          })
          .setParameter('amount', transaction.withdrawalAmount)
          .execute();

      const collateralValue: CollateralValue =
        this.collateralValueUtilService.getCollateralValue(
          collateral,
          assetPrices,
        );

      const collateralValueChange: number = this.mathUtilService.getDifference(
        collateralValue.collateralBalance,
        creditLimit.calculatedOnCollateralBalance,
      );

      if (collateralValueChange >= 10) {
        const newCreditLimit: number = this.calculateCreditLimit(
          collateralValue.collateral,
          assetPrices,
        );

        await this.creditLimitRepository
          .createQueryBuilder('CreditLimit')
          .update(CreditLimit)
          .where('userId =: userId AND calculatedAt <=: calculatedAt ', {
            userId: transaction.userId,
            calculatedAt: collateral[0].calculatedAt,
          })
          .set({
            previousCreditLimit: () => 'creditLimit',
            creditLimit: () => ': newCreditLimit',
          })
          .setParameter('newCreditLimit', newCreditLimit)
          .returning('*')
          .execute();
        // returning check if increased or decreased
        this.queueService.publish(CREDIT_LIMIT_INCREASED_TOPIC, {
          newCreditLimit: newCreditLimit,
        });
      }
    }
  }

  public calculateCreditLimit(
    collateralValue: CollateralWithPrice[],
    assetList: GetAssetPriceResponse[],
  ): number {
    return collateralValue.reduce((sum: number, value: CollateralWithPrice) => {
      const assetInformation: AssetInformation | undefined =
        assetList[value.asset];

      if (assetInformation === undefined) {
        return sum;
      }

      const actualCollateralValue: number =
        (value.price / 100) * assetInformation.ltv;

      return sum + Math.floor(actualCollateralValue);
    }, 0);
  }

  public async handleCollateralDepositCompletedEvent(
    transaction: CollateralDepositCompletedPayload,
  ): Promise<void> {
    // TODO: Store transaction ids - no duplicated events

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
    // TODO: Store transaction ids - no duplicated events

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
}
