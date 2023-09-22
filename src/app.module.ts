import {Module, OnApplicationShutdown, OnModuleInit} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./tasks/tasks.module";
// import {TypeOrmModule} from "@nestjs/typeorm";
import {PubSubService} from "./pubsub/pubsub.service";
// import {UsersModule} from "./users/users.module";
import { ConfigModule } from '@nestjs/config';
import * as process from "process";
import {FirebaseModule} from "nestjs-firebase";
import {v4 as uuidv4} from 'uuid';
import {InstanceService} from "./pubsub/instance.service";
import {TasksService} from "./tasks/tasks.service";
import {TerminusModule} from "@nestjs/terminus";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
      ScheduleModule.forRoot(),
    TasksModule,
    FirebaseModule.forRoot({
      googleApplicationCredential: "credential.json",
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT),
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASSWD,
    //   database: process.env.DB_NAME,
    //   entities: ["dist/**/*.entity{.ts,.js}"],
    //   synchronize: true,
    // }),
    // UsersModule,
    TerminusModule
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, PubSubService, InstanceService],
})
export class AppModule implements OnModuleInit, OnApplicationShutdown {
  constructor(private pubSubService: PubSubService, private instanceService: InstanceService) {
  }
  onModuleInit() {
    console.log(`Initialization...`);
    this.instanceService.setIdInstance('microservice-evaluations'+uuidv4())
    const topicName = 'health';
    return this.pubSubService.publishMessage(topicName, {scenarioType: 1, pauseNotifications: false}, 'inscription');
  }

  onApplicationShutdown(signal?: string): any {
    console.log(`Shutdown...`);
    const topicName = 'health';
    return this.pubSubService.publishMessage(topicName, {}, 'shutdown');
  }
}
