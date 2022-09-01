import { Injectable } from '@nestjs/common';
import { MarginCall } from '../margin_calls.entity';
import { MarginCheck } from '../margin_check.entity';
import { DateTime, Interval } from 'luxon';
import { MarginAction } from './utils.interfaces';
import { MathUtilService } from './math.service';
import { MarginNotification } from '../margin_notifications.entity';

@Injectable()
export class MarginActionsCheckUtilService {
  LTV_ALERT_LIMITS = [65, 70, 73];
  LTV_MARGIN_CALL_LIMIT = 75;
  LTV_DIRECT_LIQUIDATION_LIMIT = 85;

  MIN_COLLATERAL_VALUE_CHANGE = 10;

  constructor(private mathUtilService: MathUtilService) {}

  public getActions(
    activeMarginCall: MarginCall | null,
    lastMarginCheck: MarginCheck | null,
    marginNotification: MarginNotification | null,
    ltv: number,
    collateralBalance: number,
  ): MarginAction[] {
    if (lastMarginCheck !== null) {
      const collateralValueChange: number = this.mathUtilService.getDifference(
        lastMarginCheck.collateralBalance,
        collateralBalance,
      );

      if (
        collateralValueChange < this.MIN_COLLATERAL_VALUE_CHANGE &&
        activeMarginCall === null
      ) {
        return [];
      }
    }

    if (ltv >= this.LTV_DIRECT_LIQUIDATION_LIMIT) {
      const additionalActions: MarginAction[] =
        activeMarginCall === null ? [MarginAction.activate_margin_call] : [];

      return [
        ...additionalActions,
        MarginAction.liquidate,
        MarginAction.reset_margin_call_in_danger_notifications,
      ];
    }

    if (activeMarginCall === null && ltv >= this.LTV_MARGIN_CALL_LIMIT) {
      return [MarginAction.activate_margin_call];
    }

    if (
      activeMarginCall !== null &&
      ltv >= this.LTV_MARGIN_CALL_LIMIT &&
      ltv < this.LTV_DIRECT_LIQUIDATION_LIMIT
    ) {
      const hoursPassedSinceTheStartOfMarginCall: number =
        Interval.fromDateTimes(
          activeMarginCall.createdAt,
          DateTime.utc(),
        ).length('hours');

      if (hoursPassedSinceTheStartOfMarginCall >= 72) {
        return [
          MarginAction.liquidate,
          MarginAction.reset_margin_call_in_danger_notifications,
        ];
      }

      return [];
    }

    if (activeMarginCall !== null && ltv < this.LTV_MARGIN_CALL_LIMIT) {
      return [MarginAction.deactivate_margin_call];
    }

    return this.getNotificationActions(marginNotification, ltv);
  }

  private getNotificationActions(
    marginNotification: MarginNotification | null,
    ltv: number,
  ): MarginAction[] {
    if (ltv >= this.LTV_ALERT_LIMITS[0]) {
      const shouldSendNotification: boolean = this.LTV_ALERT_LIMITS.map(
        (ltvAlertLimit: number, index: number): boolean => {
          const marginNotificationNotSentYet: boolean =
            marginNotification === null ||
            !marginNotification.active ||
            marginNotification.sentAtLtv === null ||
            marginNotification.sentAtLtv < ltvAlertLimit;

          return (
            marginNotificationNotSentYet &&
            ltv >= ltvAlertLimit &&
            ltv <
              (this.LTV_ALERT_LIMITS[index + 1] ?? this.LTV_MARGIN_CALL_LIMIT)
          );
        },
      ).some((alert: boolean) => alert);

      return shouldSendNotification
        ? [MarginAction.send_margin_call_in_danger_notification]
        : [];
    }

    return marginNotification !== null
      ? [MarginAction.reset_margin_call_in_danger_notifications]
      : [];
  }
}