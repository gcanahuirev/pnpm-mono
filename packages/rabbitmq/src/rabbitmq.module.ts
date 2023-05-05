import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule, RabbitmqConfig } from '@pnpm-mono/config';
import {
  ClientsModule,
  Transport,
  RmqContext,
  RmqOptions,
} from '@nestjs/microservices';

@Module({})
export class RmqModule {
  private static getConnectionOptions(config: ConfigService): RmqOptions {
    const rmqData = config.get().rmq;
    if (!rmqData) {
      throw Error('Add rmq config to your .env file');
    }
    const connectionOptions = this.getConnectionOptionsRabbitmq(rmqData);
    return {
      ...connectionOptions,
    };
  }

  private static getConnectionOptionsRabbitmq(
    rmqData: RabbitmqConfig,
  ): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [rmqData.uri],
        queue: rmqData.queue,
        noAck: false,
        persistent: true,
      },
    };
  }

  public static nameQueue(config: ConfigService) {
    const rmqData = config.get().rmq;
    if (!rmqData) {
      throw Error('Add rmq config to your .env file');
    }
    return rmqData.queue ? rmqData.queue : 'DEFAULT';
  }

  public static ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

  public static register(config: ConfigService) {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            imports: [ConfigModule],
            name: RmqModule.nameQueue(config),
            useFactory: (configService: ConfigService) => {
              return RmqModule.getConnectionOptions(configService);
            },
            inject: [ConfigService],
          },
        ]),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
