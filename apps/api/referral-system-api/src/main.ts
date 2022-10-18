import { AppModule } from './app.module';
import './tracer';
import { start } from '@archie/api/utils/microservice';
import { SERVICE_NAME } from '@archie/api/referral-system-api/constants';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  await start(SERVICE_NAME, AppModule);
}

bootstrap().catch((error) => {
  Logger.error(error);
  throw error;
});