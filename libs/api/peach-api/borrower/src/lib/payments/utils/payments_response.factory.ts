import { Payments } from '../../api/peach_api.interfaces';
import { PaymentsResponseDto } from '../payments.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from '@archie/api/peach-api/constants';

export class PaymentsResponseFactory {
  constructor(private configService: ConfigService) {}

  public create(payments: Payments, limit: number): PaymentsResponseDto {
    const lastPaymentId: string = payments.data[payments.data.length - 1].id;
    const firstPaymentId: string = payments.data[0].id;

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
        created_at: payment.created_at,
        isExternal: payment.isExternal,
        status: payment.status,
        transactionType: payment.transactionType,
        paymentDetails: {
          type: payment.paymentDetails.type,
          reason: payment.paymentDetails.reason,
          fromInstrumentId: payment.paymentDetails.fromInstrumentId,
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
