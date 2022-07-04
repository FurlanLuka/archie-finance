import { AppModule } from './app.module';
import './tracer';
import { createMicroservice } from '@archie/microservice';

async function bootstrap() {
  await createMicroservice('onboarding-api', AppModule)
}

bootstrap();
