import { Controller, Get, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const body = req.body;
    const data = this.appService.getData();
    return res.send({ data, body });
  }
}
