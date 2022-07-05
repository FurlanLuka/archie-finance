import { AppModule } from './app.module';
import './tracer';
import { createMicroservice } from '@archie/api/utils/microservice';
import { SERVICE_NAME } from '@archie/api/referral-system/constants';

async function bootstrap() {
  await createMicroservice(SERVICE_NAME, AppModule);
}

bootstrap();
