import { Module } from '@nestjs/common';
import { Auth0Module } from '@archie/api/user-api/auth0';
import { MfaController } from './mfa.controller';
import { MfaService } from './mfa.service';

@Module({
  imports: [Auth0Module],
  providers: [MfaService],
  controllers: [MfaController],
})
export class MfaModule {}
