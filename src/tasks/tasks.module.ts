import {Module} from "@nestjs/common";
import {TasksService} from "./tasks.service";
import {TerminusModule} from "@nestjs/terminus";
import {PubSubService} from "../pubsub/pubsub.service";
import {InstanceService} from "../pubsub/instance.service";
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [

    ],
    providers: []
})
export class TasksModule {}