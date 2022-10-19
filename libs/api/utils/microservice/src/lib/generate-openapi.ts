import { NestFactory } from '@nestjs/core';
import { Openapi } from '@archie/api/utils/openapi';

export async function generateOpenapi(module: unknown): Promise<void> {
  const app = await NestFactory.create(module, {});

  await Openapi.generate(app);

  process.exit(0);
}
