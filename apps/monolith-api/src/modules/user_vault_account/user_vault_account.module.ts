import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FireblocksModule } from '../fireblocks/fireblocks.module';
import { UserVaultAccount } from './user_vault_account.entity';
import { UserVaultAccountService } from './user_vault_account.service';

@Module({
  imports: [FireblocksModule, TypeOrmModule.forFeature([UserVaultAccount])],
  exports: [UserVaultAccountService],
  providers: [UserVaultAccountService],
})
export class UserVaultAccountModule {}
