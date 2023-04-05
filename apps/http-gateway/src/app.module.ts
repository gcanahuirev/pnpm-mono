import { Module } from '@nestjs/common';
import { ConfigModule } from '@pnpm-mono/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
