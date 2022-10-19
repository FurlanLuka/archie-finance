import { NestFactory } from '@nestjs/core';
import { Openapi } from '@archie/api/utils/openapi';
import { ImportModule } from './microservice.interfaces';

export async function generateOpenapi(module: ImportModule): Promise<void> {
  const app = await NestFactory.create(module, {});

  await Openapi.generate(app);

  process.exit(0);
}
