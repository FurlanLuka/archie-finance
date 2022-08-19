import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { PeachPaymentInstrumentsService } from './payment_instruments.service';
import { BorrowerNotFoundError } from '../borrower.errors';
import { PaymentInstrumentDto } from './payment_instruments.dto';

@Controller('v1/loans/payment_instruments')
export class PeachPaymentInstrumentsController {
  constructor(private peachService: PeachPaymentInstrumentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError])
  async getCreditObligations(@Req() request): Promise<PaymentInstrumentDto[]> {
    return this.peachService.listPaymentInstruments(request.user.sub);
  }
}
