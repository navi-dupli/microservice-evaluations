import {Injectable} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {HealthCheck, HealthCheckService, TypeOrmHealthIndicator} from "@nestjs/terminus";
import {PubSubService} from "../pubsub/pubsub.service";
import {FirebaseAdmin, InjectFirebaseAdmin} from "nestjs-firebase";
import {InstanceService} from "../pubsub/instance.service";
@Injectable()
export class TasksService {
    constructor(
        private health: HealthCheckService,
        // private db: TypeOrmHealthIndicator,
        private pubSubService: PubSubService,
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
        private instanceService: InstanceService
    ) {

    }
    // @Cron('*/5 * * * * *')
    // @HealthCheck()
    // async handleCron() {
    //     try {
    //         // const result = await this.db.pingCheck('database');
    //         console.log('Health check')
    //         // const topicName = 'health';
    //         // const messageId = await this.pubSubService.publishMessage(topicName, result, 'health');
    //         // return { messageId };
    //     } catch (error) {
    //         console.log('Health check error')
    //         // const topicName = 'health';
    //         // const messageId = await this.pubSubService.publishMessage(topicName, {state: 'down'}, 'health');
    //         // return { messageId };
    //     }
    // }

    @Cron('*/5 * * * * *')
    async handleCron() {
        try {
            console.log('aaaaaaaaaaaaaaaa', this.instanceService.getIdInstance())
            const snapshot = this.firebase.firestore.collection('intances').doc(this.instanceService.getIdInstance());
            console.log('Health check', (await snapshot.get()).data())
        } catch (error) {
            console.log('Health check error', error)

        }
    }
}