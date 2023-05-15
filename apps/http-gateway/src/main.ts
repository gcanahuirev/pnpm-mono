import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            translateTime: 'SYS:dd-mm-yyyy h:MM:ss TT Z',
            ignore: 'pid,hostname',
            colorize: true,
          },
        },
        level: 'info',
      },
      trustProxy: true,
      bodyLimit: 204857600,
    }),
  );

  app.enableShutdownHooks();
  app.enableCors();
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
