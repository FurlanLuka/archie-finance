import { AuthGuard } from '@archie-microservices/auth0';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { GetDepositAddressResponseDto } from './deposit_address.dto';
import { DepositAddressService } from './deposit_address.service';

@Controller('v1/deposit_address')
export class DepositAddressController {
  constructor(private depositAddressService: DepositAddressService) {}

  @Get(':asset')
  @UseGuards(AuthGuard)
  async getDepositAddress(
    @Param('asset') asset: string,
    @Req() request,
  ): Promise<GetDepositAddressResponseDto> {
    return this.depositAddressService.getDepositAddress(
      asset,
      request.user.sub,
    );
  }
}
