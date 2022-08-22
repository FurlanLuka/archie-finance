import {
  Body,
  Controller,
  Header,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  BorrowerNotFoundError,
  PaymentInstrumentNotFound,
} from '../borrower.errors';
import { AutopayService } from './autopay.service';
import {
  AutopayAgreementDto,
  CreateAutopayDocumentDto,
  CreateAutopayDto,
} from './autopay.dto';

@Controller('v1/loans/autopay')
export class AutopayController {
  constructor(private autopayService: AutopayService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError])
  @HttpCode(204)
  async setupAutopay(
    @Req() request,
    @Body() body: CreateAutopayDto,
  ): Promise<void> {
    return this.autopayService.setupAutopay(request.user.sub, body);
  }
}

@Controller('v1/loans/autopay/documents')
export class AutopayDocumentsController {
  constructor(private autopayService: AutopayService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, PaymentInstrumentNotFound])
  async createAutopayAgreement(
    @Req() request,
    @Body() body: CreateAutopayDocumentDto,
  ): Promise<AutopayAgreementDto> {
    return this.autopayService.createAutopayAgreement(request.user.sub, body);
  }
}
