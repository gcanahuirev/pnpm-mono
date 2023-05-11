import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService, RabbitmqConfig } from '@pnpm-mono/config';
import {
  Transport,
  ClientProxyFactory,
  ClientProxy,
  RmqContext,
  RmqOptions,
} from '@nestjs/microservices';
import { RmqConfig } from './rabbitmq.interface';

@Module({})
export class RmqModule {
  private static getConnectionOptions(
    config: ConfigService,
    rmqConfig: RmqConfig,
  ): ClientProxy {
    const rmqData = config.get().rmq;
    if (!rmqData) {
      throw Error('RMQ VARIABLES NOT FOUND');
    }
    const connectionOptions = this.getConnectionOptionsAmqp(
      rmqData,
      rmqConfig.queue,
    );
    return ClientProxyFactory.create(connectionOptions);
  }

  private static getConnectionOptionsAmqp(
    rmqData: Omit<RabbitmqConfig, 'queue'>,
    queue: string,
  ): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            protocol: 'amqp',
            hostname: rmqData.host,
            port: rmqData.port,
            username: rmqData.username,
            password: rmqData.password,
          },
        ],
        noAck: false,
        queue: queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }

  public static registerRmq(
    service: string,
    rmqConfig: RmqConfig,
  ): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          return this.getConnectionOptions(configService, rmqConfig);
        },
        inject: [ConfigService],
      },
    ];
    return {
      module: RmqModule,
      controllers: [],
      providers,
      exports: providers,
    };
  }
}
