import { Module } from '@nestjs/common';
import { ConfigModule } from '@pnpm-mono/config';
import { RmqModule } from '@pnpm-mono/rabbitmq';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule, RmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
