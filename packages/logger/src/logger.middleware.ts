import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { Logger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger;
  constructor() {
    this.logger = Logger.getInstance();
  }

  use(req: FastifyRequest, res: FastifyReply, next: () => void): any {
    const correlationId = randomUUID();
    req.headers['X-Correlation-ID'] = correlationId;
    res.getHeader('X-Correlation-ID');
    this.logger.log(
      `Request: ${req.headers['X-Correlation-ID']}`,
      correlationId,
    );
    next();
  }
}
