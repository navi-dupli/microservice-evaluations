import {Body, Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {InstancesService} from "./instances/instances.service";
import {TasksService} from "./tasks/tasks.service";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private instanceService: InstancesService,
      private taskService: TasksService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('init-instance')
  initInstance(@Body() body) {
    return this.instanceService.initializeInstance(body.idInstanceApp);
  }

  @Post('shutdown-instance')
  shutdownInstance(@Body() body) {
    return this.instanceService.shutdownInstance(body.idInstanceApp);
  }

  @Post('send-health')
  sendHealth(@Body() body) {
    return this.taskService.sendHealth(body);
  }
}
