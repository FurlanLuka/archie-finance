import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { PeachPaymentInstrumentsService } from './payment_instrument.service';
import { BorrowerNotFoundError } from '../borrower.errors';
import {
  ConnectAccountDto,
  PaymentInstrumentDto,
} from './payment_instruments.dto';

@Controller('v1/payment_instruments')
export class PeachPaymentInstrumentsController {
  constructor(private peachService: PeachPaymentInstrumentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError])
  async getPaymentInstruments(@Req() request): Promise<PaymentInstrumentDto[]> {
    return this.peachService.listPaymentInstruments(request.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async connectAccount(
    @Req() req,
    @Body() body: ConnectAccountDto,
  ): Promise<void> {
    return this.peachService.connectAccount(req.user.sub, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async removeAccount(
    @Req() req,
    @Param('id') id: string,
  ): Promise<void> {
    return this.peachService.removePaymentInstrument(req.user.sub, id);
  }
}
