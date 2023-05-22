import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@pnpm-mono/config';
import { LoggerModule } from '@pnpm-mono/logger';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get().port;
  }
}
