import { NestFactory } from '@nestjs/core';
import { FrontendModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { PORT } from './utils/env';

async function bootstrap() {
  const app = await NestFactory.create(FrontendModule);

  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(PORT);
}

bootstrap().then(() => 'connected');
