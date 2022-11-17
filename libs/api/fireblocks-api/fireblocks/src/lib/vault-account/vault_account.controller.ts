import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { VaultAccountService } from './vault_account.service';
import { DepositAddressDto } from '@archie/api/fireblocks-api/data-transfer-objects';

@Controller('/v1/vault_account')
export class VaultAccountController {
  constructor(private vaultAccountService: VaultAccountService) {}

  @Get('deposit_address/:assetId')
  @UseGuards(AuthGuard)
  async getOrCreateDepositAddresss(
    @Req() request,
    @Param('assetId') assetId: string,
  ): Promise<DepositAddressDto> {
    return this.vaultAccountService.getOrCreateDepositAddress(
      assetId,
      request.user.sub,
    );
  }
}
