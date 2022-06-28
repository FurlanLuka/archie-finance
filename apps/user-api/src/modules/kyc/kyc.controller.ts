import { AuthGuard } from '@archie-microservices/auth0';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KycDto, CreateKycResponseDto, GetKycResponseDto } from './kyc.dto';
import { KycService } from './kyc.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getKyc(@Req() request): Promise<GetKycResponseDto> {
    return this.kycService.getKyc(request.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async createKyc(
    @Body() body: KycDto,
    @Req() request,
  ): Promise<CreateKycResponseDto> {
    return this.kycService.createKyc(body, request.user.sub);
  }
}

@Controller('internal/kyc')
export class InternalKycController {
  constructor(private readonly kycService: KycService) {}

  @Get(':userId')
  async getKyc(@Param('userId') userId: string): Promise<GetKycResponseDto> {
    return this.kycService.getKyc(userId);
  }
}
