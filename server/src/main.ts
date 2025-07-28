import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: 'https://todolist-sandy-beta.vercel.app',
  });

  await app.listen(configService.get<number>('PORT') ?? 8000);
}
bootstrap();
