import {Module, OnApplicationShutdown, OnModuleInit} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ScheduleModule} from "@nestjs/schedule";
// import {TypeOrmModule} from "@nestjs/typeorm";
import {PubSubService} from "./pubsub/pubsub.service";
import { ConfigModule } from '@nestjs/config';
import {FirebaseModule} from "nestjs-firebase";
import {v4 as uuidv4} from 'uuid';
import {TasksService} from "./tasks/tasks.service";
import {TerminusModule} from "@nestjs/terminus";
import {InstancesService} from "./instances/instances.service";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
      ScheduleModule.forRoot(),
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
    TerminusModule
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, PubSubService, InstancesService],
})
export class AppModule {
  constructor(private pubSubService: PubSubService, private instanceService: InstancesService) {
  }
  // onModuleInit() {
  //   console.log(`Initialization...`);
  //   this.instanceService.setIdInstance('microservice-evaluations'+uuidv4())
  //   const topicName = 'health';
  //   return this.pubSubService.publishMessage(topicName, {scenarioType: 1, pauseNotifications: true}, 'inscription');
  // }
  //
  // onApplicationShutdown(signal?: string): any {
  //   console.log(`Shutdown...`);
  //   const topicName = 'health';
  //   return this.pubSubService.publishMessage(topicName, {}, 'shutdown');
  // }
}
