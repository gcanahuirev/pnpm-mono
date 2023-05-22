import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@pnpm-mono/config';
import { LoggerModule as LoggerModulePino, Logger } from 'nestjs-pino';

import { LoggerMiddleware } from './logger.middleware';
import { ServerResponse } from 'http';

@Module({
  imports: [
    ConfigModule,
    LoggerModulePino.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        pinoHttp: {
          level: config.get().logLevel,
          transport: {
            target: 'pino-pretty',
            options: {
              levelFirst: true,
              translateTime: 'SYS:dd-mm-yyyy h:MM:ss TT Z',
              ignore: 'pid,hostname',
              colorize: true,
            },
          },
          serializers: {
            req: (req: any) => ({
              method: req.method,
              url: req.url,
              host: req.headers.host,
              remoteAddress: req.remoteAddress,
              remotePort: req.remotePort,
            }),
            res: (res: ServerResponse) => ({
              statusCode: res.statusCode,
            }),
            err: (err: Error) => ({
              message: err.message,
              stack: err.stack,
            }),
          },

          // Define a custom success message
          customSuccessMessage: function () {
            return 'request completed';
          },

          // Define a custom receive message
          customReceivedMessage: function () {
            return 'incoming request';
          },

          // Define a custom error message
          customErrorMessage: function () {
            return 'request errored';
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule extends LoggerModulePino {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
