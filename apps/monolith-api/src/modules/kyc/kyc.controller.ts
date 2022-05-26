import { AuthGuard } from '@archie-microservices/auth0';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { KycDto } from './kyc.dto';
import { CreateKycResponse, GetKycResponse } from './kyc.interfaces';
import { KycService } from './kyc.service';

@Controller('v1/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getKyc(@Req() request): Promise<GetKycResponse> {
    return this.kycService.getKyc(request.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createKyc(
    @Body() body: KycDto,
    @Req() request,
  ): Promise<CreateKycResponse> {
    return this.kycService.createKyc(
      body.firstName,
      body.lastName,
      body.dateOfBirth.toISOString(),
      body.address,
      body.phoneNumberCountryCode,
      body.phoneNumber,
      body.ssn,
      request.user.sub,
    );
  }
}
