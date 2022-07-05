import { Injectable } from '@nestjs/common';
import { GenerateAddressResponse, VaultAccountResponse } from 'fireblocks-sdk';
import { ConfigService } from '@archie-microservices/config';
import { FireblocksService } from '../fireblocks/fireblocks.service';
import { ConfigVariables } from '@archie/api/collateral-api/constants';

@Injectable()
export class OmnibusVaultAccountService {
  private omnibusVaultAccountId: string;

  constructor(
    configService: ConfigService,
    private fireblocksService: FireblocksService,
  ) {
    this.omnibusVaultAccountId = configService.get(
      ConfigVariables.FIREBLOCKS_VAULT_ACCOUNT_ID,
    );
  }

  public async generateDepositAddress(
    asset: string,
    userId: string,
  ): Promise<GenerateAddressResponse> {
    return this.fireblocksService.generateDepositAddress(
      this.omnibusVaultAccountId,
      asset,
      userId,
    );
  }

  public async getVaultAccounts(): Promise<VaultAccountResponse[]> {
    return this.fireblocksService.getVaultAccounts();
  }
}
