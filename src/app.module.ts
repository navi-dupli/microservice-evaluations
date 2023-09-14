import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./tasks/tasks.module";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
      ScheduleModule.forRoot(),
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'test',
      entities: [],
      synchronize: true
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
