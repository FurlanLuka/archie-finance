import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { PaypalService } from './paypal.service';
import { CreatePaymentDto } from './paypal.dto';

@Controller('v1/paypal')
export class PaypalController {

  constructor(private paypalService: PaypalService) {}

  @Post('payment')
  // @UseGuards(AuthGuard)
  public async createPayment(@Req() req, @Body() body: CreatePaymentDto): Promise<void> {
    return this.paypalService.createPaymentIdentifier('58bd3c43-40f0-4eb5-b95e-ca32b6e3a715', body.paymentAmount)
  }
}
