import { Module } from '@nestjs/common';
import { ConfigModule } from '@pnpm-mono/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
