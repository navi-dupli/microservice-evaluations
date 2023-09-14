import {Module} from "@nestjs/common";
import {TasksService} from "./tasks.service";
import {TerminusModule} from "@nestjs/terminus";
import {PubSubService} from "../pubsub/pubsub.service";

@Module({
    imports: [TerminusModule],
    providers: [TasksService, PubSubService]
})
export class TasksModule {}