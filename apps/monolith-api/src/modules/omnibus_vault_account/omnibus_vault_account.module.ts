import { Module } from '@nestjs/common';
import { FireblocksModule } from '../fireblocks/fireblocks.module';
import { OmnibusVaultAccountService } from './omnibus_vault_account.service';

@Module({
  imports: [FireblocksModule],
  exports: [OmnibusVaultAccountService],
  providers: [OmnibusVaultAccountService],
})
export class OmnibusVaultAccountModule {}
