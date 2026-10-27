import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './catalogo/infrastructure/http/domain-exception.filter';
import { AppLogger } from './catalogo/infrastructure/logging/app-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new DomainExceptionFilter(app.get(AppLogger)));

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

bootstrap();
