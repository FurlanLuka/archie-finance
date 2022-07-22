import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { SendgridModule } from '@archie/api/mail-api/sendgrid';
import { HealthModule } from '@archie/api/utils/health';
import { InternalApiModule } from '@archie/api/utils/internal';

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
        ConfigVariables.SENDGRID_MARGIN_CALL_EXITED_TEMPLATE_ID,
        ConfigVariables.SENDGRID_MARGIN_CALL_REACHED_TEMPLATE_ID,
        ConfigVariables.SENDGRID_MARGIN_CALL_IN_DANGER_TEMPLATE_ID,
        ConfigVariables.SENDGRID_COLLATERAL_LIQUIDATED_TEMPLATE_ID,
      ],
    }),
    InternalApiModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        internalApiUrl: configService.get(ConfigVariables.INTERNAL_API_URL),
      }),
    }),
    HealthModule,
    SendgridModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
