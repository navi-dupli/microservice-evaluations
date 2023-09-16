import {Module, OnApplicationShutdown, OnModuleInit} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./tasks/tasks.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PubSubService} from "./pubsub/pubsub.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '/cloudsql/proyecto-final-xcloud:us-east1:proyecto-final-db',
      username: 'xcloud',
      password: 'Umc{]i2bIx.`$zP%',
      database: 'postgres',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PubSubService],
})
export class AppModule implements OnModuleInit, OnApplicationShutdown {
  constructor(private pubSubService: PubSubService) {
  }
  onModuleInit() {
    console.log(`Initialization...`);
    const topicName = 'health';
    return this.pubSubService.publishMessage(topicName, {}, 'inscription');
  }

  onApplicationShutdown(signal?: string): any {
    console.log(`Shutdown...`);
    const topicName = 'health';
    return this.pubSubService.publishMessage(topicName, {}, 'shutdown');
  }
}
