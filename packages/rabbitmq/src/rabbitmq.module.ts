import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@pnpm-mono/config';
import { ClientProxyFactory, ClientProxy } from '@nestjs/microservices';
import { RmqConfig } from './rabbitmq.interface';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RmqModule {
  private static getConnectionOptions(
    config: ConfigService,
    rmqConfig: RmqConfig,
  ): ClientProxy {
    const rmqData = config.get().rmq;
    if (!rmqData) {
      throw Error('RMQ VARIABLES NOT FOUND');
    }
    const connectionOptions = RabbitmqService.getConnectionOptionsAmqp(
      rmqData,
      rmqConfig.queue,
    );
    return ClientProxyFactory.create(connectionOptions);
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
