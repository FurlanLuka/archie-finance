import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SERVICE_NAME } from '@archie/api/credit-limit-api/constants';
import { start } from '@archie/api/utils/microservice';
import './tracer';

async function bootstrap(): Promise<void> {
  await start(SERVICE_NAME, AppModule);
}

bootstrap().catch((error) => {
  Logger.error(error);
  throw error;
});
