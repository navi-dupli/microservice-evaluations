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
      host: '34.74.44.122',
      port: 5432,
      username: 'xcloud',
      password: 'Umc{]i2bIx.`$zP%',
      database: 'postgres',
      entities: [],
      synchronize: true,
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
