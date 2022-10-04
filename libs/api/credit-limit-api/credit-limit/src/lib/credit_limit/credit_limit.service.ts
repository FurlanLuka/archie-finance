import { Injectable } from '@nestjs/common';
import { LedgerAccountUpdatedPayload } from '@archie/api/ledger-api/data-transfer-objects';
import { LedgerService } from '../ledger/ledger.service';
import { MathUtilService } from '../utils/math.service';
import { LedgerAccount } from '../ledger/ledger_account.entity';
import { AssetsService } from '../assets/assets.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditLimit } from '../credit_limit.entity';
import { Repository } from 'typeorm';
import { QueueService } from '@archie/api/utils/queue';
import { CREDIT_LIMIT_UPDATED_TOPIC } from '../../../../constants/src';
import { CreditLimitUpdatedPayload } from '@archie/api/credit-limit-api/data-transfer-objects';
import BigNumber from 'bignumber.js';

@Injectable()
export class CreditLimitService {
  private MINIMUM_COLLATERAL_CHANGE_PERCENTAGE_TO_ADJUST_CREDIT_LIMIT = 10;
  private MAXIMUM_CREDIT_LIMIT = 2000;
  private MINIMUM_CREDIT_LIMIT = 200;

  constructor(
    private ledgerService: LedgerService,
    private mathService: MathUtilService,
    private assetsService: AssetsService,
    private queueService: QueueService,
    @InjectRepository(CreditLimit)
    private creditLimitRepository: Repository<CreditLimit>,
  ) {}

  public async ledgerAccountUpdatedHandler({
    userId,
    ledgerAccounts,
  }: LedgerAccountUpdatedPayload): Promise<void> {
    await this.ledgerService.updateLedgerAccounts(userId, ledgerAccounts);

    const updatedLedgerAccounts: LedgerAccount[] =
      await this.ledgerService.getLedgerAccounts(userId);

    await this.tryUpdatingCreditLimit(userId, updatedLedgerAccounts);
  }

  public async tryUpdatingCreditLimit(
    userId: string,
    ledgerAccounts: LedgerAccount[],
  ): Promise<void> {
    const creditLimitRecord: CreditLimit | null =
      await this.creditLimitRepository.findOneBy({
        userId,
      });

    if (creditLimitRecord === null) {
      // Don't do anything, credit hasnt been created yet
      return;
    }

    const updatedLedgerValue: number = await this.ledgerService.getLedgerValue(
      ledgerAccounts,
    );

    const percentageDifference = this.mathService.getDifference(
      creditLimitRecord.calculatedOnLedgerValue,
      updatedLedgerValue,
    );

    if (
      percentageDifference >=
      this.MINIMUM_COLLATERAL_CHANGE_PERCENTAGE_TO_ADJUST_CREDIT_LIMIT
    ) {
      const updatedCreditLimit = this.calculateCreditLimit(ledgerAccounts);

      await this.creditLimitRepository.update({
        userId,
      }, {
        creditLimit: updatedCreditLimit,
        calculatedOnLedgerValue: updatedLedgerValue,
      })

      this.queueService.publish<CreditLimitUpdatedPayload>(
        CREDIT_LIMIT_UPDATED_TOPIC,
        {
          userId,
          creditLimit: updatedCreditLimit,
          calculatedAt: Date.now(),
        },
      );
    }
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
          .multipliedBy(assetInformation.ltv)
          .decimalPlaces(2, BigNumber.ROUND_DOWN);

        return previousValue.plus(assetCreditLimitUtilization);
      },
      BigNumber(0),
    );

    return Math.min(this.MAXIMUM_CREDIT_LIMIT, creditLimit.toNumber());
  }
}
