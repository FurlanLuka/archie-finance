/* eslint-disable @typescript-eslint/naming-convention */
export interface CreateOrderLink {
  href: string;
  rel: string;
  method: string;
}

export interface CreateOrderResponse {
  id: string;
  links: CreateOrderLink[];
}

export interface Captures {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
  final_capture: boolean;
  custom_id: string;
}

export interface PurchaseUnit {
  payments: {
    captures: Captures[];
  };
}

export interface CaptureOrderResponse {
  id: string;
  status: string;
  purchase_units: PurchaseUnit[];
}
