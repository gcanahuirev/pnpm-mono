import { Injectable } from '@nestjs/common';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { RabbitmqConfig } from '@pnpm-mono/config';

@Injectable()
export class RabbitmqService {
  public static getConnectionOptionsAmqp(
    rmqData: RabbitmqConfig,
    queue: string,
  ): RmqOptions {
    if (!rmqData) {
      throw Error('RMQ VARIABLES NOT FOUND');
    }
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

  public static acknowledgeMessage(context: RmqContext): void {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
