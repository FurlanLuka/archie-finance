import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FireblocksModule } from '@archie/api/collateral-api/fireblocks';
import { UserVaultAccount } from './user-vault-account.entity';
import { UserVaultAccountService } from './user-vault-account.service';

@Module({
  imports: [FireblocksModule, TypeOrmModule.forFeature([UserVaultAccount])],
  exports: [UserVaultAccountService],
  providers: [UserVaultAccountService],
})
export class UserVaultAccountModule {}
