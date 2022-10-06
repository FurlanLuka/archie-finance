import { Injectable } from '@nestjs/common';
import { MarginCall } from '../margin_calls.entity';
import { MarginCallsDto, MarginCallStatus } from '../margin.dto';
import { DateTime } from 'luxon';
import { MARGIN_CALL_LIQUIDATION_AFTER_HOURS } from '@archie/api/margin-api/constants';

@Injectable()
export class MarginCallFactory {
  public create(marginCall: MarginCall): MarginCallsDto {
    return {
      createdAt: marginCall.createdAt.toISOString(),
      automaticLiquidationAt: DateTime.fromISO(
        marginCall.createdAt.toISOString(),
      )
        .plus({
          hour: MARGIN_CALL_LIQUIDATION_AFTER_HOURS,
        })
        .toUTC()
        .toString(),
      status:
        marginCall.deletedAt === null
          ? MarginCallStatus.active
          : MarginCallStatus.completed,
    };
  }
}
