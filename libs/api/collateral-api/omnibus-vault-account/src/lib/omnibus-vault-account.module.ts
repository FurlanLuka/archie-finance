import { Module } from '@nestjs/common';
import { FireblocksModule } from '@archie/api/collateral-api/fireblocks';
import { OmnibusVaultAccountService } from './omnibus-vault-account.service';

@Module({
  imports: [FireblocksModule],
  exports: [OmnibusVaultAccountService],
  providers: [OmnibusVaultAccountService],
})
export class OmnibusVaultAccountModule {}
