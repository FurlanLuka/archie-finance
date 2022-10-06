import { Injectable } from '@nestjs/common';
import { LtvDto, LtvStatus } from './ltv.dto';
import { QueueService } from '@archie/api/utils/queue';
import { LtvUtilService } from './utils/ltv.service';
import { LedgerService } from '../ledger/ledger.service';
import {
  LedgerAccountUpdatedPayload,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects';
import {
  CreditBalanceUpdatedPayload,
  PaymentType,
} from '@archie/api/peach-api/data-transfer-objects';
import { CreditLineCreatedPayload } from '@archie/api/credit-line-api/data-transfer-objects';
import { CreditService } from '../credit/credit.service';
import { Lock } from '@archie-microservices/api/utils/redis';
import { MarginService } from '../margin/margin.service';
import { LedgerAccount } from '../ledger/ledger_account.entity';

@Injectable()
export class LtvService {
  constructor(
    private queueService: QueueService,
    private ltvUtilService: LtvUtilService,
    private ledgerService: LedgerService,
    private creditService: CreditService,
    private marginService: MarginService,
  ) {}

  async getCurrentLtv(userId: string): Promise<LtvDto> {
    const updatedLedgerAccounts: LedgerAccount[] =
      await this.ledgerService.getLedgerAccounts(userId);
    const ledgerValue: number = this.ledgerService.getLedgerValue(
      updatedLedgerAccounts,
    );
    const creditUtilization: number = await this.creditService.getCreditBalance(
      userId,
    );

    const ltv: number = this.ltvUtilService.calculateLtv(
      creditUtilization,
      ledgerValue,
    );
    const ltvStatus: LtvStatus = this.ltvUtilService.getLtvStatus(ltv);

    return {
      ltv,
      status: ltvStatus,
    };
  }

  @Lock((ledger: LedgerAccountUpdatedPayload) => ledger.userId)
  async handleLedgerAccountUpdatedEvent({
    userId,
    ledgerAccounts,
    action,
  }: LedgerAccountUpdatedPayload): Promise<void> {
    await this.ledgerService.updateLedgerAccounts(userId, ledgerAccounts);

    if (action?.type === LedgerActionType.liquidation) {
      await this.marginService.acknowledgeLiquidationCollateralBalanceUpdate(
        action.liquidation!.id,
      );
    }

    const updatedLedgerAccounts: LedgerAccount[] =
      await this.ledgerService.getLedgerAccounts(userId);
    const ledgerValue: number = this.ledgerService.getLedgerValue(
      updatedLedgerAccounts,
    );
    const creditUtilization: number = await this.creditService.getCreditBalance(
      userId,
    );
    const ltvMeta = await this.marginService.reducePendingLiquidationAmount(
      userId,
      creditUtilization,
      ledgerValue,
    );
    const ltv: number = this.ltvUtilService.calculateLtv(
      ltvMeta.creditUtilization,
      ltvMeta.ledgerValue,
    );

    await this.marginService.executeMarginCallCheck(userId, ltv, ltvMeta);
  }

  @Lock((credit: CreditBalanceUpdatedPayload) => credit.userId)
  public async handleCreditBalanceUpdatedEvent(
    credit: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    await this.creditService.updateCreditBalance(credit);
    if (credit.paymentDetails?.type === PaymentType.liquidation) {
      await this.marginService.acknowledgeLiquidationCreditBalanceUpdate(
        credit.paymentDetails.id,
      );
    }

    const updatedLedgerAccounts: LedgerAccount[] =
      await this.ledgerService.getLedgerAccounts(credit.userId);
    const ledgerValue: number = this.ledgerService.getLedgerValue(
      updatedLedgerAccounts,
    );
    const creditUtilization: number = await this.creditService.getCreditBalance(
      credit.userId,
    );
    const ltvMeta = await this.marginService.reducePendingLiquidationAmount(
      credit.userId,
      creditUtilization,
      ledgerValue,
    );
    const ltv: number = this.ltvUtilService.calculateLtv(
      ltvMeta.creditUtilization,
      ltvMeta.ledgerValue,
    );

    await this.marginService.executeMarginCallCheck(
      credit.userId,
      ltv,
      ltvMeta,
    );
  }

  public async handleCreditLineCreatedEvent({
    userId,
  }: CreditLineCreatedPayload): Promise<void> {
    await this.creditService.createCreditBalance(userId);
  }
}
