import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ArgusService } from './services/argus.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly argusService: ArgusService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
