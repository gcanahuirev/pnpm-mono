import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@pnpm-mono/config';
import { RabbitmqService } from '@pnpm-mono/rabbitmq';

import { AppModule } from './app.module';
import { STORAGE_SERVICE } from './constanst';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const rmq = app.get(RabbitmqService);

  app.connectMicroservice(rmq.getRabbitmqOptions(config, STORAGE_SERVICE));
  await app.startAllMicroservices();
  await app.listen(config.get().port);
  console.debug(`🚀 Microservice is running on: ${await app.getUrl()}`);
}
void bootstrap();
