import { Controller, Get, Req, Res } from '@nestjs/common';
// import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    /* req.headers['X-Correlation-ID'] = randomUUID();
    console.log('req', req.headers);
    const response = res
      .header('X-Correlation-ID', req.headers['X-Correlation-ID'])
      .getHeaders();
    console.log('response', response); */

    const body = req.body;
    const data = this.appService.getData();
    return res.send({ data, body });
  }
}
