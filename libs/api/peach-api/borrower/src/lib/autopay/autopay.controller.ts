import { Body, Controller, Delete, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  AutopayAlreadyConfiguredError,
  AutopayNotConfiguredError,
  BorrowerNotFoundError,
  CreditLineNotFoundError,
  PaymentInstrumentNotFound,
} from '../borrower.errors';
import { AutopayService } from './autopay.service';
import {
  AutopayAgreementDto,
  AutopayDto,
  CreateAutopayDocumentDto,
  CreateAutopayDto,
} from '@archie/api/peach-api/data-transfer-objects';

@Controller('v1/loan_autopay')
export class AutopayController {
  constructor(private autopayService: AutopayService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([
    BorrowerNotFoundError,
    CreditLineNotFoundError,
    PaymentInstrumentNotFound,
    AutopayAlreadyConfiguredError,
  ])
  @HttpCode(204)
  async setupAutopay(@Req() request, @Body() body: CreateAutopayDto): Promise<void> {
    return this.autopayService.setupAutopay(request.user.sub, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([
    BorrowerNotFoundError,
    CreditLineNotFoundError,
    PaymentInstrumentNotFound,
    AutopayNotConfiguredError,
  ])
  async cancelAutopay(@Req() request): Promise<void> {
    return this.autopayService.cancelAutopay(request.user.sub);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([
    BorrowerNotFoundError,
    CreditLineNotFoundError,
    PaymentInstrumentNotFound,
    AutopayNotConfiguredError,
  ])
  async getAutopayConfig(@Req() request): Promise<AutopayDto> {
    return this.autopayService.getConfiguredAutopay(request.user.sub);
  }
}

@Controller('v1/loan_autopay/documents')
export class AutopayDocumentsController {
  constructor(private autopayService: AutopayService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, PaymentInstrumentNotFound])
  async createAutopayAgreement(@Req() request, @Body() body: CreateAutopayDocumentDto): Promise<AutopayAgreementDto> {
    return this.autopayService.createAutopayAgreement(request.user.sub, body);
  }
}
