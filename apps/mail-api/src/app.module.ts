import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { SendgridModule } from '@archie/api/mail-api/sendgrid';
import { HealthModule } from '@archie-microservices/health';

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
      parse: (_configVariable, value) => value,
    }),
    HealthModule,
    SendgridModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        API_KEY: configService.get(ConfigVariables.SENDGRID_API_KEY),
        API_URL: configService.get(ConfigVariables.SENDGRID_API_URL),
        MAILING_LIST_ID: configService.get(
          ConfigVariables.SENDGRID_MAILING_LIST_ID,
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
