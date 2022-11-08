import { Injectable } from '@nestjs/common';
import { MarginCall } from '../margin_calls.entity';
import { MarginCall as MarginCallResponse, MarginCallStatus } from '@archie/api/ltv-api/data-transfer-objects/types';
import { DateTime } from 'luxon';
import { MARGIN_CALL_LIQUIDATION_AFTER_HOURS } from '@archie/api/ltv-api/constants';

@Injectable()
export class MarginCallFactory {
  public create(marginCall: MarginCall): MarginCallResponse {
    return {
      createdAt: marginCall.createdAt.toISOString(),
      automaticLiquidationAt: DateTime.fromISO(marginCall.createdAt.toISOString())
        .plus({
          hour: MARGIN_CALL_LIQUIDATION_AFTER_HOURS,
        })
        .toUTC()
        .toString(),
      status: marginCall.deletedAt === null ? MarginCallStatus.active : MarginCallStatus.completed,
    };
  }
}
