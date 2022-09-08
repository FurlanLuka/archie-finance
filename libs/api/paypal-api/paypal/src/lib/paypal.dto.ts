import { IsNumber, IsPositive } from 'class-validator';
import { OrderStatus } from './paypal.interfaces';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  paymentAmount: number;
}

export class CreateOrderResponseDto {
  id: string;
  paymentUrl: string;
}

export class GetOrderResponseDto {
  id: string;
  status: OrderStatus;
  amount: number;
}

export interface PaypalPaymentReceivedPayload {
  userId: string;
  amount: number;
  orderId: string;
  currency: string;
}
