import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from '@pnpm-mono/logger';

import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.enableShutdownHooks();
  app.enableCors();
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );

  /* ======= INIT DOC SWAGGER ======= */
  initSwagger(app);

  await app.listen(AppModule.port);
  logger.log(`🚀 Gateway running on: ${await app.getUrl()}`);
  logger.debug(`📜 Swagger generated on ${await app.getUrl()}/api/swagger`);
}

void bootstrap();
