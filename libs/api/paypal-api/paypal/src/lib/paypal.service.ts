import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaypalApiService } from './api/paypal_api.service';
import { PaymentIdentifier } from './payment_identifier.entity';

@Injectable()
export class PaypalService {
  constructor(
    private paypalApiService: PaypalApiService,
    @InjectRepository(PaymentIdentifier)
    private paymentIdentifierRepository: Repository<PaymentIdentifier>,
  ) {}

  public async createPaymentIdentifier(
    userId: string,
    paymentAmount: number,
  ): Promise<void> {
    const paymentIdentifier: PaymentIdentifier =
      await this.paymentIdentifierRepository.save({
        userId,
        paymentAmount,
      });

    return this.paypalApiService.createPaymentOrder(
      paymentIdentifier.id,
      paymentAmount,
    );
  }
}
