import { Injectable } from '@nestjs/common';
import { LedgerAccountUpdatedPayload } from '@archie/api/ledger-api/data-transfer-objects/types';
import { LedgerService } from '../ledger/ledger.service';
import { LedgerAccount } from '../ledger/ledger_account.entity';
import { AssetsService } from '../assets/assets.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditLine } from './credit_line.entity';
import { In, Repository } from 'typeorm';
import { QueueService } from '@archie/api/utils/queue';
import {
  CREDIT_LINE_UPDATED_TOPIC,
  CREDIT_LINE_CREATED_TOPIC,
} from '@archie/api/credit-line-api/constants';
import { CreditLine as CreditLineResponse } from '@archie/api/credit-line-api/data-transfer-objects/types';
import {
  CreditLineAlreadyExistsError,
  CreditLineNotFoundError,
  NotEnoughCollateralError,
} from './credit_line.errors';
import BigNumber from 'bignumber.js';
import { CreditLimitAssetAllocationService } from '../credit_limit_asset_allocation/credit_limit_asset_allocation.service';
import { Lock } from '@archie/api/utils/redis';
import { GroupingHelper } from '@archie/api/utils/helpers';
import { LedgerAccountsPerUser } from '../ledger/ledger.interfaces';

@Injectable()
export class CreditLineService {
  private MINIMUM_COLLATERAL_CHANGE_PERCENTAGE_TO_ADJUST_CREDIT_LIMIT = 10;
  private MAXIMUM_CREDIT_LIMIT = 2000;
  private MINIMUM_CREDIT_LIMIT = 200;

  constructor(
    private creditLimitAssetAllocationService: CreditLimitAssetAllocationService,
    private ledgerService: LedgerService,
    private assetsService: AssetsService,
    private queueService: QueueService,
    @InjectRepository(CreditLine)
    private creditLineRepository: Repository<CreditLine>,
  ) {}

  @Lock((payload: LedgerAccountUpdatedPayload) => payload.userId)
  public async ledgerAccountUpdatedHandler({
    userId,
    ledgerAccounts,
  }: LedgerAccountUpdatedPayload): Promise<void> {
    await this.ledgerService.updateLedgerAccounts(userId, ledgerAccounts);

    const updatedLedgerAccounts: LedgerAccount[] =
      await this.ledgerService.getLedgerAccounts(userId);

    await this.tryUpdatingCreditLimit(userId, updatedLedgerAccounts);
  }

  // TODO: lock
  public async ledgerAccountsUpdatedHandler(
    ledgers: LedgerAccountUpdatedPayload[],
  ): Promise<void> {
    await this.ledgerService.updateLedgers(ledgers);

    const userIds: string[] = ledgers.map((ledger) => ledger.userId);
    const updatedLedgerAccounts: LedgerAccountsPerUser =
      await this.ledgerService.getLedgerAccountsForMultipleUsers(userIds);

    await this.tryUpdatingCreditLimits(userIds, updatedLedgerAccounts);
  }

  public async tryUpdatingCreditLimits(
    userIds: string[],
    ledgerAccounts: LedgerAccountsPerUser,
  ): Promise<void> {
    const creditLines: CreditLine[] = await this.creditLineRepository.findBy({
      userId: In(userIds),
    });
    creditLines.map(async ({ userId, calculatedOnLedgerValue }: CreditLine) => {
      const usersLedgerAccounts: LedgerAccount[] = ledgerAccounts[userId] ?? [];

      const updatedLedgerValue: number =
        this.ledgerService.getLedgerValue(usersLedgerAccounts);

      const percentageDifference = this.getPercentageDifference(
        calculatedOnLedgerValue,
        updatedLedgerValue,
      );

      if (
        percentageDifference >=
        this.MINIMUM_COLLATERAL_CHANGE_PERCENTAGE_TO_ADJUST_CREDIT_LIMIT
      ) {
        const updatedCreditLimit =
          this.calculateCreditLimit(usersLedgerAccounts);
        const calculatedAt = new Date().toISOString();

        await this.creditLineRepository.update(
          {
            userId,
          },
          {
            creditLimit: updatedCreditLimit,
            calculatedOnLedgerValue: updatedLedgerValue,
            calculatedAt,
          },
        );

        this.queueService.publishEvent(CREDIT_LINE_UPDATED_TOPIC, {
          userId,
          creditLimit: updatedCreditLimit,
          calculatedAt,
        });
      }
    });
  }

  public async tryUpdatingCreditLimit(
    userId: string,
    ledgerAccounts: LedgerAccount[],
  ): Promise<void> {
    const creditLineRecord: CreditLine | null =
      await this.creditLineRepository.findOneBy({
        userId,
      });

    if (creditLineRecord === null) {
      // Don't do anything, credit hasnt been created yet
      return;
    }

    const updatedLedgerValue: number =
      this.ledgerService.getLedgerValue(ledgerAccounts);

    const percentageDifference = this.getPercentageDifference(
      creditLineRecord.calculatedOnLedgerValue,
      updatedLedgerValue,
    );

    if (
      percentageDifference >=
      this.MINIMUM_COLLATERAL_CHANGE_PERCENTAGE_TO_ADJUST_CREDIT_LIMIT
    ) {
      const updatedCreditLimit = this.calculateCreditLimit(ledgerAccounts);
      const calculatedAt = new Date().toISOString();

      await this.creditLineRepository.update(
        {
          userId,
        },
        {
          creditLimit: updatedCreditLimit,
          calculatedOnLedgerValue: updatedLedgerValue,
          calculatedAt,
        },
      );

      this.queueService.publishEvent(CREDIT_LINE_UPDATED_TOPIC, {
        userId,
        creditLimit: updatedCreditLimit,
        calculatedAt,
      });
    }
  }

  public async createCreditLine(userId: string): Promise<CreditLineResponse> {
    const creditLineRecord: CreditLine | null =
      await this.creditLineRepository.findOneBy({
        userId,
      });

    if (creditLineRecord !== null) {
      throw new CreditLineAlreadyExistsError({
        userId,
      });
    }

    const ledgerAccounts = await this.ledgerService.getLedgerAccounts(userId);
    const ledgerValue = this.ledgerService.getLedgerValue(ledgerAccounts);
    const creditLimit = this.calculateCreditLimit(ledgerAccounts);
    const creditLimitAssetAllocation =
      this.creditLimitAssetAllocationService.calculate(
        creditLimit,
        ledgerAccounts,
      );

    if (creditLimit < this.MINIMUM_CREDIT_LIMIT) {
      throw new NotEnoughCollateralError({
        userId,
        creditLimit,
      });
    }

    const calculatedAt = new Date().toISOString();

    await this.creditLineRepository.save({
      userId,
      calculatedOnLedgerValue: ledgerValue,
      calculatedAt,
      creditLimit,
    });

    this.queueService.publishEvent(CREDIT_LINE_CREATED_TOPIC, {
      userId,
      creditLimit,
      calculatedAt,
      ledgerValue,
    });

    return {
      creditLimit,
      creditLimitAssetAllocation,
    };
  }

  public async getCreditLine(userId: string): Promise<CreditLineResponse> {
    const creditLineRecord: CreditLine | null =
      await this.creditLineRepository.findOneBy({
        userId,
      });

    if (creditLineRecord === null) {
      throw new CreditLineNotFoundError({
        userId,
      });
    }

    const ledgerAccounts = await this.ledgerService.getLedgerAccounts(userId);
    const creditLimitAssetAllocation =
      this.creditLimitAssetAllocationService.calculate(
        creditLineRecord.creditLimit,
        ledgerAccounts,
      );

    return {
      creditLimit: creditLineRecord.creditLimit,
      creditLimitAssetAllocation,
    };
  }

  public calculateCreditLimit(ledgerAccounts: LedgerAccount[]): number {
    const creditLimit = ledgerAccounts.reduce(
      (previousValue, ledgerAccount) => {
        const assetInformation = this.assetsService.getAssetInformation(
          ledgerAccount.assetId,
        );

        if (assetInformation === undefined) {
          return previousValue;
        }

        const assetCreditLimitUtilization = BigNumber(ledgerAccount.value)
          .dividedBy(100)
          .multipliedBy(assetInformation.assetToCreditUtilizationPercentage)
          .decimalPlaces(2, BigNumber.ROUND_DOWN);

        return previousValue.plus(assetCreditLimitUtilization);
      },
      BigNumber(0),
    );

    return Math.min(this.MAXIMUM_CREDIT_LIMIT, creditLimit.toNumber());
  }

  private getPercentageDifference(
    value: number,
    comparingValue: number,
  ): number {
    return (
      (Math.abs(value - comparingValue) / ((value + comparingValue) / 2)) * 100
    );
  }
}
