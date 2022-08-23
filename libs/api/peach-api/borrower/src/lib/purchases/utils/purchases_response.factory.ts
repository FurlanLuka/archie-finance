import { Purchases } from '../../api/peach_api.interfaces';
import { PurchasesResponseDto } from '../purchases.dto';
import { ConfigVariables } from '@archie/api/peach-api/constants';
import { ConfigService } from '@archie/api/utils/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PurchasesResponseFactory {
  constructor(private configService: ConfigService) {}

  public create(purchases: Purchases, limit: number): PurchasesResponseDto {
    const lastPurchaseId: string | undefined =
      purchases.data[purchases.data.length - 1]?.id;
    const firstPurchaseId: string | undefined = purchases.data[0]?.id;

    return {
      meta: {
        total: purchases.total,
        count: purchases.count,
        nextUrl:
          purchases.nextUrl !== null
            ? `${this.configService.get(
                ConfigVariables.API_BASE_URL,
              )}/v1/card_purchases?startingAfter=${lastPurchaseId}&limit=${limit}`
            : null,
        previousUrl:
          purchases.previousUrl !== null
            ? `${this.configService.get(
                ConfigVariables.API_BASE_URL,
              )}/v1/card_purchases?endingBefore=${firstPurchaseId}&limit=${limit}`
            : null,
      },
      data: purchases.data.map((purchase) => ({
        id: purchase.id,
        description: purchase.purchaseDetails.description,
        type: purchase.type,
        status: purchase.status,
        amount: purchase.amount,
        denialReason: purchase.declineReason,
        timestamps: {
          createdAt: purchase.timestamps.createdAt,
          settledAt: purchase.timestamps.effectiveAt,
        },
        purchaseDetails: {
          mcc: purchase.purchaseDetails.merchantCategoryCode,
          merchantLocation: purchase.purchaseDetails.merchantCity,
          merchantName: purchase.purchaseDetails.merchantName,
          merchantNumber: purchase.purchaseDetails.merchantId,
          transactionType: purchase.purchaseDetails.metadata?.transactionType,
        },
      })),
    };
  }
}
