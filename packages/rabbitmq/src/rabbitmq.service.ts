import { Injectable } from '@nestjs/common';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@pnpm-mono/config';

@Injectable()
export class RabbitmqService {
  public getRabbitmqOptions(config: ConfigService, queue?: string): RmqOptions {
    if (!config.get().rmq) {
      throw Error('RMQ VARIABLES NOT FOUND');
    }
    const HOST = config.get().rmq.host;
    const PORT = config.get().rmq.port;
    const USERNAME = config.get().rmq.username;
    const PASSWORD = config.get().rmq.password;
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`],
        queue,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  public acknowledgeMessage(context: RmqContext): void {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
