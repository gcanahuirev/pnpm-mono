import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const CORRELATION_ID = 'X-Correlation-Id';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): any {
    const correlationId = randomUUID();
    req.headers[CORRELATION_ID] = correlationId;
    res.set(CORRELATION_ID, correlationId);
    next();
  }
}
