import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { PaypalService } from './paypal.service';
import {
  CreateOrderResponseDto,
  CreateOrderDto,
  GetOrderResponseDto,
} from './paypal.dto';
import { PaypalWebhookBody } from './paypal.interfaces';

@Controller('v1/paypal')
export class PaypalController {
  constructor(private paypalService: PaypalService) {}

  @Post('orders')
  @UseGuards(AuthGuard)
  public async createOrder(
    @Req() req,
    @Body() body: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    return this.paypalService.createOrder(req.user.sub, body.paymentAmount);
  }

  @Get('orders/:orderId')
  @UseGuards(AuthGuard)
  public async getOrder(
    @Req() req,
    @Param('orderId') orderId: string,
  ): Promise<GetOrderResponseDto> {
    return this.paypalService.getOrder(req.user.sub, orderId);
  }

  @Get('orders')
  @UseGuards(AuthGuard)
  public async getOrders(@Req() req): Promise<GetOrderResponseDto[]> {
    return this.paypalService.getOrders(req.user.sub);
  }

  @Post('orders/:orderId/capture')
  public async captureOrder(@Param('orderId') orderId: string): Promise<void> {
    return this.paypalService.captureOrder(orderId);
  }

  @Post('webhook')
  public async handleWebhook(
    @Req() req,
    @Body() body: PaypalWebhookBody,
  ): Promise<void> {
    return this.paypalService.webhookHandler(req.headers, body);
  }
}
