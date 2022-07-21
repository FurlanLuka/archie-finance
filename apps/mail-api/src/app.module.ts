import { Module } from '@nestjs/common';
import { ConfigModule } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { SendgridModule } from '@archie/api/mail-api/sendgrid';
import { HealthModule } from '@archie/api/utils/health';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.QUEUE_URL,
        ConfigVariables.SENDGRID_API_KEY,
        ConfigVariables.SENDGRID_MAILING_LIST_ID,
        ConfigVariables.SENDGRID_API_URL,
        ConfigVariables.SENDGRID_VERIFY_EMAIL_TEMPLATAE_ID,
        ConfigVariables.ARCHIE_MARKETING_WEBSITE_URL,
      ],
    }),
    HealthModule,
    SendgridModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
