import { LtvMeta } from '../margin.interfaces';
import { MarginCall } from '../margin_calls.entity';

export enum MarginAction {
  activate_margin_call = 'activate_margin_call',
  deactivate_margin_call = 'deactivate_margin_call',
  complete_margin_call = 'complete_margin_call',
  liquidate = 'liquidate',
  send_margin_call_in_danger_notification = 'send_margin_call_in_danger_notification',
  reset_margin_call_in_danger_notifications = 'reset_margin_call_in_danger_notifications',
}

export interface MarginActionHandlerPayload {
  userId: string;
  ltv: number;
  ltvMeta: LtvMeta;
  marginCall: MarginCall | null;
}
