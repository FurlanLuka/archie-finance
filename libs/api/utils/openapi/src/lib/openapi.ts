import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { ErrorResponse } from './decorators';

export class Openapi {
  public static async generate(app: INestApplication): Promise<void> {
    const config = new DocumentBuilder()
      .setTitle('Archie finance API')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ErrorResponse],
    });

    fs.mkdirSync(`${__dirname}/target/generated`, { recursive: true });
    fs.writeFileSync(
      `${__dirname}/target/generated/swagger.json`,
      JSON.stringify(document, undefined, 2),
    );
  }
}
