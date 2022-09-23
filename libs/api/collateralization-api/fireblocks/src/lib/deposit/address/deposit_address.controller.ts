import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { DepositAddressService } from './deposit-address.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { DepositAddressUnknownAssetError } from './deposit_address.errors';
import { GetDepositAddressResponseDto } from '@archie/api/collateralization-api/data-transfer-objects';

@Controller('v1/fireblocks/deposit/address')
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
