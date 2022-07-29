import { AuthGuard } from '@archie/api/utils/auth0';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  KycDto,
  CreateKycResponse,
  GetKycResponse,
  GetKycPayload,
} from './kyc.interfaces';
import { KycService } from './kyc.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { KycAlreadySubmitted, KycNotFoundError } from './kyc.errors';
import {
  RequestHandler,
  RPCResponse,
  RPCResponseType,
} from '@archie/api/utils/queue';
import {
  GET_USER_KYC_RPC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/user-api/constants';
import { RabbitPayload } from '@golevelup/nestjs-rabbitmq';

@Controller('v1/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiErrorResponse([KycNotFoundError])
  async getKyc(@Req() request): Promise<GetKycResponse> {
    return this.kycService.getKyc(request.user.sub);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiErrorResponse([KycAlreadySubmitted])
  async createKyc(
    @Body() body: KycDto,
    @Req() request,
  ): Promise<CreateKycResponse> {
    return this.kycService.createKyc(body, request.user.sub);
  }
}

@Controller()
export class KycQueueController {
  constructor(private readonly kycService: KycService) {}

  @RequestHandler(GET_USER_KYC_RPC, SERVICE_QUEUE_NAME)
  async getKyc(
    @RabbitPayload() payload: GetKycPayload,
  ): Promise<RPCResponse<GetKycResponse>> {
    Logger.log('here222')
    try {
      const data = await this.kycService.getKyc(payload.userId);

      Logger.log(data);

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      Logger.error(error);
  
      return {
        type: RPCResponseType.ERROR,
        message: error.message,
      };
    }
  }
}
