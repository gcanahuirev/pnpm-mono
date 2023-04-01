import { Injectable } from '@nestjs/common';

/**
 * AppService
 * @class AppService
 * @classdesc AppService
 * @example new AppService()
 * @example new AppService().getData()
 */
@Injectable()
export class AppService {
  getData(): string {
    return 'Welcome to http-gateway!';
  }
}
