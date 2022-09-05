import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { PaypalService } from './paypal.service';

@Controller('v1/paypal')
export class PaypalController {

  constructor(private paypalService: PaypalService) {}

  @Post('payment_identifier')
  @UseGuards(AuthGuard)
  public async createPaymentIdentifier(@Req() req): Promise<void> {
    
  }
}
