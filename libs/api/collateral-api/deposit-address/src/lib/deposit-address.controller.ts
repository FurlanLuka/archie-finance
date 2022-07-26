import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { GetDepositAddressResponseDto } from './deposit-address.dto';
import { DepositAddressService } from './deposit-address.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { DepositAddressUnknownAssetError } from './deposit-address.errors';

@Controller('v1/deposit_address')
export class DepositAddressController {
  constructor(private depositAddressService: DepositAddressService) {}

  @Get(':asset')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([DepositAddressUnknownAssetError])
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
