import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables, SERVICE_NAME } from '@archie/api/mail-api/constants';
import { SendgridModule } from '@archie/api/mail-api/sendgrid';
import { HealthModule } from '@archie/api/utils/health';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from '@archie/api/utils/queue';
import { migrations } from './migrations';

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
        ConfigVariables.ENCRYPTION_KEY,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(ConfigVariables.TYPEORM_HOST),
        username: configService.get(ConfigVariables.TYPEORM_USERNAME),
        password: configService.get(ConfigVariables.TYPEORM_PASSWORD),
        database: configService.get(ConfigVariables.TYPEORM_DATABASE),
        port: configService.get(ConfigVariables.TYPEORM_PORT),
        synchronize: false,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        migrationsRun: configService.get(ConfigVariables.RUN_MIGRATIONS) !== 'false',
        migrationsTableName: `${SERVICE_NAME}-migrations`,
        migrations: migrations,
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    SendgridModule,
    QueueModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
