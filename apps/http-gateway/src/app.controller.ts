import { Controller, Get, Req, Request } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@Req() req: Request) {
    const body = req.body;
    const data = this.appService.getData();
    return { data, body };
  }
}
