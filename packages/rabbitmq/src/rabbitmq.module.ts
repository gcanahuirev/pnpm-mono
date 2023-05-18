import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@pnpm-mono/config';
import {
  ClientProxy,
  ClientProxyFactory,
  ClientsModule,
} from '@nestjs/microservices';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [ConfigModule],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})

/* Clientes de microservicios de RabbitMQ */
export class RmqModule {
  /* Clase para crear de forma programática */
  public static registerRmqProxy(
    service: string,
    queue: string,
  ): DynamicModule {
    if (!queue) {
      throw Error('QUEUE NAME NOT FOUND');
    }
    if (!service) {
      throw Error('SERVICE NAME NOT FOUND');
    }
    const providers: Provider[] = [
      {
        provide: service,
        useFactory: (
          rabbitService: RabbitmqService,
          config: ConfigService,
        ): ClientProxy => {
          const opts = rabbitService.getRabbitmqOptions(config, queue);
          return ClientProxyFactory.create(opts);
        },
        inject: [RabbitmqService, ConfigService],
      },
    ];
    return {
      module: RmqModule,
      providers,
      exports: providers,
    };
  }

  /* Módulo de configuración completo */
  public registerRmq(service: string, queue: string): DynamicModule {
    if (!queue) {
      throw Error('QUEUE NAME NOT FOUND');
    }
    if (!service) {
      throw Error('SERVICE NAME NOT FOUND');
    }
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: service,
            useFactory: (
              rabbitService: RabbitmqService,
              config: ConfigService,
            ) => {
              return rabbitService.getRabbitmqOptions(config, queue);
            },
            inject: [RabbitmqService, ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
