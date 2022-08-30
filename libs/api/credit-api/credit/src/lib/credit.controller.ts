import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GetCreditResponseDto } from './credit.dto';
import { CreditService } from './credit.service';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateCreditMinimumCollateralError,
  CreditNotFoundError,
} from './credit.errors';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { Subscribe } from '@archie/api/utils/queue';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/credit-api/constants';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects';

@Controller('v1/credit')
export class CreditController {
  constructor(private creditService: CreditService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([CreateCreditMinimumCollateralError])
  async createCreditLine(@Request() req): Promise<GetCreditResponseDto> {
    return this.creditService.createCredit(req.user.sub);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([CreateCreditMinimumCollateralError])
  async getCreditLine(@Request() req): Promise<GetCreditResponseDto> {
    return this.creditService.createCredit(req.user.sub);
  }
}

@Controller('internal/credit')
export class InternalCreditController {
  constructor(private creditService: CreditService) {}

  @Post(':userId')
  @ApiErrorResponse([CreateCreditMinimumCollateralError])
  async createCreditLine(
    @Param('userId') userId: string,
  ): Promise<GetCreditResponseDto> {
    return this.creditService.createCredit(userId);
  }

  @Get(':userId')
  @ApiErrorResponse([CreateCreditMinimumCollateralError, CreditNotFoundError])
  async getCreditLine(
    @Param('userId') userId: string,
  ): Promise<GetCreditResponseDto> {
    return this.creditService.getCredit(userId);
  }
}

@Controller()
export class CreditQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-credit`;

  constructor(private creditService: CreditService) {}

  @Subscribe(
    CREDIT_BALANCE_UPDATED_TOPIC,
    CreditQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLinePaymentReceivedHandler(
    payload: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    await this.creditService.updateCredit(payload);
  }
}
