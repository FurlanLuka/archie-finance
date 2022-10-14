/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderLink, PurchaseUnit } from './api/paypal_api.interfaces';
import { PaypalApiService } from './api/paypal_api.service';
import { Order } from './order.entity';
import { v4 } from 'uuid';
import {
  OrderStatus,
  PaypalEventType,
  PaypalWebhookBody,
  WebhookHeaders,
} from './paypal.interfaces';
import {
  CreateOrderResponseDto,
  GetOrderResponseDto,
} from './paypal.dto';
import { QueueService } from '@archie/api/utils/queue';
import {
  PAYPAL_PAYMENT_CURRENCY,
  PAYPAL_PAYMENT_RECEIVED_TOPIC,
} from '@archie/api/paypal-api/constants';

@Injectable()
export class PaypalService {
  constructor(
    private paypalApiService: PaypalApiService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private queueService: QueueService,
  ) {}

  public async createOrder(
    userId: string,
    paymentAmount: number,
  ): Promise<CreateOrderResponseDto> {
    const orderReferenceId: string = v4();

    const response = await this.paypalApiService.createPaymentOrder(
      orderReferenceId,
      paymentAmount,
    );

    const paymentUrl: CreateOrderLink | undefined = response.links.find(
      (link) => link.rel === 'approve',
    );

    if (paymentUrl === undefined) {
      throw new InternalServerErrorException();
    }

    await this.orderRepository.save({
      id: orderReferenceId,
      userId,
      paymentAmount,
      orderId: response.id,
      orderStatus: OrderStatus.CREATED,
    });

    return {
      id: response.id,
      paymentUrl: paymentUrl.href,
    };
  }

  public async captureOrder(orderId: string): Promise<void> {
    await this.paypalApiService.captureOrder(orderId);
  }

  public async getOrder(
    userId: string,
    orderId: string,
  ): Promise<GetOrderResponseDto> {
    const order: Order | null = await this.orderRepository.findOneBy({
      userId,
      orderId,
    });

    if (order === null) {
      throw new NotFoundException();
    }

    return {
      id: order.orderId,
      status: order.orderStatus,
      amount: order.paymentAmount,
    };
  }

  public async getOrders(userId: string): Promise<GetOrderResponseDto[]> {
    const orders: Order[] = await this.orderRepository.findBy({
      userId,
    });

    return orders.map((order) => ({
      id: order.orderId,
      status: order.orderStatus,
      amount: order.paymentAmount,
    }));
  }

  public async webhookHandler(
    headers: WebhookHeaders,
    body: PaypalWebhookBody,
  ): Promise<void> {
    // TODO: header validation
    if (body.event_type !== PaypalEventType['CHECKOUT.ORDER.APPROVED']) {
      return;
    }

    const order: Order | null = await this.orderRepository.findOneBy({
      orderId: body.resource.id,
    });

    if (order === null) {
      return;
    }

    const response = await this.paypalApiService.captureOrder(order.orderId);

    const purchasedUnit: PurchaseUnit | undefined =
      response.purchase_units.find((unit) => {
        const capture = unit.payments.captures.find(
          (cap) => cap.custom_id === order.id,
        );

        return capture !== undefined;
      });

    if (purchasedUnit === undefined) {
      return;
    }

    await this.orderRepository.update(
      {
        id: order.id,
      },
      {
        orderStatus: OrderStatus.COMPLETED,
      },
    );

    this.queueService.publishEvent(
      PAYPAL_PAYMENT_RECEIVED_TOPIC,
      {
        userId: order.userId,
        amount: order.paymentAmount,
        orderId: order.orderId,
        currency: PAYPAL_PAYMENT_CURRENCY,
      },
    );
  }
}
