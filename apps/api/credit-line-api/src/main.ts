import { AppModule } from './app.module';
import './tracer';
import { start } from '@archie/api/utils/microservice';
import { SERVICE_NAME } from '@archie/api/credit-line-api/constants';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  await start(SERVICE_NAME, AppModule);
}

bootstrap().catch((error) => {
  Logger.error(error);
  throw error;
});
