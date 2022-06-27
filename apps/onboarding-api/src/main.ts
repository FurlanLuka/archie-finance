import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import './tracer';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

const buildSwagger: boolean = process.argv.some(arg => arg === 'build-swagger')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
            // utilities.format.nestLike('API', { prettyPrint: true }),
          ),
        }),
      ],
    }),
  });

  console.log(buildSwagger)
  if (buildSwagger) {
    const config = new DocumentBuilder()
        // .setTitle('Cats example')
        // .setDescription('The cats API description')
        // .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    console.log(JSON.stringify(document))
    console.log(`${__dirname}/target/generated/swagger.json`)

    fs.mkdirSync(`${__dirname}/target/generated`, { recursive: true });
    fs.writeFileSync(`${__dirname}/target/generated/swagger.json`, JSON.stringify(document,undefined, 2));
    await app.close()
    process.exit(0)
  }
  else {
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors();

    await app.listen(80);
  }
}
bootstrap();
