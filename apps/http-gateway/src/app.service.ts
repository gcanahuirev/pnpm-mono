import { Injectable } from '@nestjs/common';
import { ConfigService } from '@pnpm-mono/config';

/**
 * AppService
 * @class AppService
 * @classdesc AppService
 * @example new AppService()
 * @example new AppService().getData()
 */
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getData(): string {
    const config = this.configService.get();
    return JSON.stringify(config.env || 'Welcome to http-gateway!');
  }
}
