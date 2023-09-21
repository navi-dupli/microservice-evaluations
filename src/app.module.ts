import {Module, OnApplicationShutdown, OnModuleInit} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./tasks/tasks.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PubSubService} from "./pubsub/pubsub.service";
import {UsersModule} from "./users/users.module";
import { ConfigModule } from '@nestjs/config';
import * as process from "process";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
      ScheduleModule.forRoot(),
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      database: process.env.DB_NAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }), UsersModule,
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
