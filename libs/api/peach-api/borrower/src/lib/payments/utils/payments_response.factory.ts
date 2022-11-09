import { PaymentsResponse } from '@archie/api/peach-api/data-transfer-objects/types';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/peach-api/constants';
import { Injectable } from '@nestjs/common';
import { Payments } from '@archie/api/peach-api/data-transfer-objects/types';

@Injectable()
export class PaymentsResponseFactory {
  constructor(private configService: ConfigService) {}

  public create(payments: Payments, limit: number): PaymentsResponse {
    const lastPaymentId: string | undefined = payments.data[payments.data.length - 1]?.id;
    const firstPaymentId: string | undefined = payments.data[0]?.id;

    return {
      meta: {
        total: payments.total,
        count: payments.count,
        nextUrl:
          payments.nextUrl !== null
            ? `${this.configService.get(
                ConfigVariables.API_BASE_URL,
              )}/v1/loan_payments?startingAfter=${lastPaymentId}&limit=${limit}`
            : null,
        previousUrl:
          payments.previousUrl !== null
            ? `${this.configService.get(
                ConfigVariables.API_BASE_URL,
              )}/v1/loan_payments?endingBefore=${firstPaymentId}&limit=${limit}`
            : null,
      },
      data: payments.data.map((payment) => ({
        id: payment.id,
        timestamps: {
          createdAt: payment.timestamps.createdAt,
          scheduledDate: payment.timestamps.scheduledDate,
          succeededAt: payment.timestamps.succeededAt,
          failedAt: payment.timestamps.failedAt,
          chargebackAt: payment.timestamps.chargebackAt,
        },
        isExternal: payment.isExternal,
        status: payment.status,
        transactionType: payment.transactionType,
        paymentDetails: {
          type: payment.paymentDetails.type,
          reason: payment.paymentDetails.reason,
          fromInstrumentId: payment.paymentDetails.fromInstrumentId,
          paymentNetworkName: payment.paymentDetails.fromInstrument.paymentNetworkName,
          accountNumberLastFour: payment.paymentDetails.fromInstrument.accountNumberLastFour,
        },
        actualAmount: payment.actualAmount,
        currency: payment.currency,
        failureDescriptionShort: payment.failureDescriptionShort,
        failureDescriptionLong: payment.failureDescriptionLong,
        autopayPlanId: payment.autopayPlanId,
        cancelReason: payment.cancelReason,
      })),
    };
  }
}
