import {
  Body,
  Controller,
  Delete,
  Get,
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
  AutopayNotConfiguredError,
  BorrowerNotFoundError,
  PaymentInstrumentNotFound,
} from '../borrower.errors';
import { AutopayService } from './autopay.service';
import {
  AutopayAgreementDto,
  AutopayDto,
  CreateAutopayDocumentDto,
  CreateAutopayDto,
} from './autopay.dto';

@Controller('v1/loans/autopay')
export class AutopayController {
  constructor(private autopayService: AutopayService) {}

  @Post()
  //@UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, PaymentInstrumentNotFound])
  @HttpCode(204)
  async setupAutopay(
    @Req() request,
    @Body() body: CreateAutopayDto,
  ): Promise<void> {
    // return this.autopayService.setupAutopay(request.user.sub, body);
    return this.autopayService.setupAutopay('aaa', body);
  }

  @Delete()
  //@UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([
    BorrowerNotFoundError,
    PaymentInstrumentNotFound,
    AutopayNotConfiguredError,
  ])
  async cancelAutopay(@Req() request): Promise<void> {
    // return this.autopayService.cancelAutopay(request.user.sub);
    return this.autopayService.cancelAutopay('aaa');
  }

  @Get()
  //@UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, PaymentInstrumentNotFound])
  async getAutopayConfig(@Req() request): Promise<AutopayDto> {
    // return this.autopayService.getConfiguredAutopay(request.user.sub);
    return this.autopayService.getConfiguredAutopay('aaa');
  }
}

@Controller('v1/loans/autopay/documents')
export class AutopayDocumentsController {
  constructor(private autopayService: AutopayService) {}

  @Post()
  //@UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, PaymentInstrumentNotFound])
  async createAutopayAgreement(
    @Req() request,
    @Body() body: CreateAutopayDocumentDto,
  ): Promise<AutopayAgreementDto> {
    //return this.autopayService.createAutopayAgreement(request.user.sub, body);
    return this.autopayService.createAutopayAgreement('aaa', body);
  }
}
