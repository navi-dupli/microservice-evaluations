import {Injectable} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {HealthCheck, HealthCheckResult, HealthCheckService, TypeOrmHealthIndicator} from "@nestjs/terminus";
import {PubSubService} from "../pubsub/pubsub.service";
@Injectable()
export class TasksService {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
        private pubSubService: PubSubService
    ) {}
    @Cron('*/30 * * * * *')
    @HealthCheck()
    async handleCron() {
        try {
            const result = await this.db.pingCheck('database');
            const topicName = 'health';
            const messageId = await this.pubSubService.publishMessage(topicName, result);
            console.log(result, messageId);
            return { messageId };
        } catch (error) {
            console.log(error);
        }
    }
}