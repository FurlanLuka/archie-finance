import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '@archie/api/utils/queue';
import { GetLoanBalancesResponse } from '@archie/api/peach-api/data-transfer-objects';
import { GET_LOAN_BALANCES_RPC } from '@archie/api/peach-api/constants';
import { LedgerService } from '../ledger/ledger.service';
import { BigNumber } from 'bignumber.js';
import {
  Ledger,
  InternalLedgerAccountData,
  WithdrawResponseDto,
} from '@archie/api/ledger-api/data-transfer-objects';
import { MaxWithdrawalAmountResponse } from '@archie/api/ledger-api/data-transfer-objects';
import {
  InvalidAssetError,
  InvalidWithdrawalAmountError,
  WithdrawalAmountTooHighError,
} from './withdraw.errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdrawal, WithdrawalStatus } from './withdrawal.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CollateralWithdrawalTransactionErrorPayload,
  CollateralWithdrawalTransactionSubmittedPayload,
  CollateralWithdrawalTransactionUpdatedPayload,
  CollateralWithdrawalTransactionUpdatedStatus,
  InitiateCollateralWithdrawalCommandPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects';
import { INITIATE_COLLATERAL_WITHDRAWAL_COMMAND } from '@archie/api/fireblocks-api/constants';
import { v4 } from 'uuid';
import { AssetInformation, AssetsService } from '@archie/api/ledger-api/assets';

@Injectable()
export class WithdrawService {
  constructor(
    private ledgerService: LedgerService,
    private queueService: QueueService,
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
    private dataSource: DataSource,
    private assetService: AssetsService,
  ) {}

  static MIN_LTV = 0.3;

  public async getMaxWithdrawalAmount(
    userId: string,
    assetId: string,
  ): Promise<MaxWithdrawalAmountResponse> {
    const ledger: Ledger = await this.ledgerService.getLedger(userId);

    const ledgerAccount: InternalLedgerAccountData | undefined =
      ledger.accounts.find((account) => account.assetId === assetId);

    if (ledgerAccount === undefined) {
      return {
        maxAmount: BigNumber(0).toString(),
      };
    }

    const loanBalances: GetLoanBalancesResponse =
      await this.queueService.request(GET_LOAN_BALANCES_RPC, {
        userId,
      });

    if (loanBalances.utilizationAmount === 0) {
      return {
        maxAmount: ledgerAccount.assetAmount,
      };
    }

    const amountRequiredForMinimumLtv = BigNumber(
      loanBalances.utilizationAmount,
    ).dividedBy(WithdrawService.MIN_LTV);

    const maxWithdrawableAmount = BigNumber.max(
      BigNumber(ledger.value).minus(amountRequiredForMinimumLtv),
      0,
    );

    return {
      maxAmount: BigNumber.min(
        maxWithdrawableAmount,
        ledgerAccount.accountValue,
      )
        .dividedBy(ledgerAccount.assetPrice)
        .toString(),
    };
  }

  public async withdraw(
    userId: string,
    assetId: string,
    amount: string,
    destinationAddress: string,
  ): Promise<WithdrawResponseDto> {
    const assetInformation: AssetInformation | undefined =
      this.assetService.getAssetInformation(assetId);

    if (assetInformation === undefined) {
      throw new InvalidAssetError({
        userId,
        assetId,
        amount,
      });
    }

    const withdrawalAmount = BigNumber(amount).decimalPlaces(18);

    if (withdrawalAmount.lte(0)) {
      throw new InvalidWithdrawalAmountError({
        userId,
        assetId,
        amount,
      });
    }

    const maxWithdrawalAmount: MaxWithdrawalAmountResponse =
      await this.getMaxWithdrawalAmount(userId, assetId);

    if (withdrawalAmount.gt(BigNumber(maxWithdrawalAmount.maxAmount))) {
      throw new WithdrawalAmountTooHighError({
        userId,
        assetId,
        amount,
      });
    }

    const internalTransactionId: string = v4();

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
      await queryRunner.manager.insert(Withdrawal, {
        userId,
        assetId,
        internalTransactionId,
        amount,
        status: WithdrawalStatus.INITIATED,
      });

      await this.ledgerService.decrementLedgerAccount(
        userId,
        assetId,
        amount,
        'Withdrawal decrement',
      );
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    this.queueService.publish<InitiateCollateralWithdrawalCommandPayload>(
      INITIATE_COLLATERAL_WITHDRAWAL_COMMAND,
      {
        userId,
        assetId,
        amount,
        internalTransactionId,
        destinationAddress,
      },
    );

    return {
      id: internalTransactionId,
    };
  }

  public async withdrawalTransactionSubmittedHandler({
    internalTransactionId,
    transactionId,
    userId,
  }: CollateralWithdrawalTransactionSubmittedPayload): Promise<void> {
    const withdrawalRecord: Withdrawal | null =
      await this.withdrawalRepository.findOneBy({
        internalTransactionId,
      });

    if (withdrawalRecord === null) {
      Logger.error({
        code: 'WITHDRAWAL_RECORD_NOT_FOUND',
        metadata: {
          handler: 'submitted',
          transactionId,
          internalTransactionId,
          userId,
        },
      });

      return;
    }

    await this.withdrawalRepository.update(
      {
        internalTransactionId,
      },
      {
        externalTransactionId: transactionId,
        status: WithdrawalStatus.SUBMITTED,
      },
    );
  }

  public async withdrawalTransactionUpdatedHandler({
    userId,
    internalTransactionId,
    transactionId,
    status,
    assetId,
    networkFee,
  }: CollateralWithdrawalTransactionUpdatedPayload): Promise<void> {
    const withdrawalRecord: Withdrawal | null =
      await this.withdrawalRepository.findOne({
        where: [
          { externalTransactionId: transactionId },
          {
            internalTransactionId,
          },
        ],
      });

    if (withdrawalRecord === null) {
      Logger.error({
        code: 'WITHDRAWAL_RECORD_NOT_FOUND',
        metadata: {
          handler: 'updated',
          status,
          transactionId,
          internalTransactionId,
          userId,
        },
      });

      return;
    }

    if (
      status === CollateralWithdrawalTransactionUpdatedStatus.COMPLETED &&
      withdrawalRecord.status === WithdrawalStatus.FEE_REDUCED
    ) {
      await this.withdrawalRepository.update(
        {
          internalTransactionId,
        },
        {
          externalTransactionId: transactionId,
          status: WithdrawalStatus.COMPLETED,
        },
      );
    } else {
      if (withdrawalRecord.status === WithdrawalStatus.SUBMITTED) {
        await this.ledgerService.decrementLedgerAccount(
          userId,
          assetId,
          networkFee,
          'Network fee decrement',
        );

        await this.withdrawalRepository.update(
          {
            internalTransactionId,
          },
          {
            externalTransactionId: transactionId,
            status: WithdrawalStatus.FEE_REDUCED,
            networkFee,
          },
        );
      }
    }
  }

  public async withdrawalTransactionErrorHandler({
    internalTransactionId,
    transactionId,
    userId,
    assetId,
  }: CollateralWithdrawalTransactionErrorPayload): Promise<void> {
    const withdrawalRecord: Withdrawal | null =
      await this.withdrawalRepository.findOne({
        where: [
          { externalTransactionId: transactionId },
          {
            internalTransactionId,
          },
        ],
      });

    if (withdrawalRecord === null) {
      Logger.error({
        code: 'WITHDRAWAL_RECORD_NOT_FOUND',
        metadata: {
          handler: 'error',
          transactionId,
          internalTransactionId,
          userId,
        },
      });

      return;
    }

    const withdrawalAmount = BigNumber(withdrawalRecord.amount);
    const networkFee = BigNumber(withdrawalRecord.networkFee);

    await this.ledgerService.incrementLedgerAccount(
      userId,
      assetId,
      withdrawalAmount.plus(networkFee).toString(),
      'Transaction failed increment',
    );

    await this.withdrawalRepository.update(
      {
        internalTransactionId,
      },
      {
        externalTransactionId: transactionId,
        status: WithdrawalStatus.FAILED,
      },
    );
  }
}
