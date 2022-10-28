import { AuthGuard } from '@archie/api/utils/auth0';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { KycService } from './kyc.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { KycAlreadySubmitted, KycNotFoundError } from './kyc.errors';
import { RPCResponse, RPCResponseType } from '@archie/api/utils/queue';
import {
  GET_USER_KYC_RPC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/user-api/constants';
import { RequestHandler } from '@archie/api/utils/queue/decorators/request_handler';
import { KycDto } from '@archie/api/user-api/data-transfer-objects';
import {
  KycResponse,
  GetKycPayload,
} from '@archie/api/user-api/data-transfer-objects/types';

@Controller('v1/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiErrorResponse([KycNotFoundError])
  async getKyc(@Req() request): Promise<KycResponse> {
    return this.kycService.getKyc(request.user.sub);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiErrorResponse([KycAlreadySubmitted])
  async createKyc(@Body() body: KycDto, @Req() request): Promise<KycResponse> {
    return this.kycService.createKyc(body, request.user.sub);
  }
}

@Controller()
export class KycQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-kyc`;

  constructor(private readonly kycService: KycService) {}

  @RequestHandler(GET_USER_KYC_RPC, KycQueueController.CONTROLLER_QUEUE_NAME)
  async getKyc(payload: GetKycPayload): Promise<RPCResponse<KycResponse>> {
    try {
      const data = await this.kycService.getKyc(payload.userId);

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      return {
        type: RPCResponseType.ERROR,
        message: error.message,
      };
    }
  }
}
