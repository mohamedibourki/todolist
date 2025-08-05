import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import './instrument';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  await app.listen(8001, '0.0.0.0');
}
bootstrap();
