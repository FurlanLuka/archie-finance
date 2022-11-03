import { Module } from '@nestjs/common';
import { ConfigModule } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/tests/utils-api/constants';
import { HealthModule } from '@archie/api/utils/health';
import { AuthModule } from '@archie/tests/utils-api/auth';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.AUTH0_AUDIENCE,
        ConfigVariables.AUTH0_DOMAIN,
      ],
    }),
    HealthModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
