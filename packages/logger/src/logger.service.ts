import { Injectable, Logger as LoggerNest } from '@nestjs/common';

@Injectable()
export class Logger extends LoggerNest {
  private static instance: Logger;
  constructor() {
    super();
    this.context = 'HTTP';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}
