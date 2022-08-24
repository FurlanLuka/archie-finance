import { AppModule } from './app.module';
import './tracer';
import { start } from '@archie/api/utils/microservice';
import { SERVICE_NAME } from '@archie/api/asset-price-api/constants';

async function bootstrap(): Promise<void> {
  await start(SERVICE_NAME, AppModule);
}

bootstrap();
