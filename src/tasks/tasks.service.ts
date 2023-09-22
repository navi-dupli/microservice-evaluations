import {Injectable} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {HealthCheck, HealthCheckService, TypeOrmHealthIndicator} from "@nestjs/terminus";
import {PubSubService} from "../pubsub/pubsub.service";
import {FirebaseAdmin, InjectFirebaseAdmin} from "nestjs-firebase";
import {InstancesService} from "../instances/instances.service";
@Injectable()
export class TasksService {
    constructor(
        private health: HealthCheckService,
        // private db: TypeOrmHealthIndicator,
        private pubSubService: PubSubService,
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
        private instanceService: InstancesService
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

    async sendHealth(instanceData) {
        const { idInstanceApp, scenarioType } = instanceData;
        try {
            const snapshot = this.firebase.firestore.collection('intances').doc(idInstanceApp);
            await snapshot.update({scenarioType});

            const data = (await snapshot.get()).data();
            // if (!data.pauseNotifications) {
            console.log('Health check', data)
            const topicName = 'health';
            const messageId = await this.pubSubService.publishMessage(topicName, idInstanceApp, {health: this.setHealth(data)}, 'health');
            return { messageId };
            // }
        } catch (error) {
            console.log('Health check error', error)
            const topicName = 'health';
            const messageId = await this.pubSubService.publishMessage(topicName, idInstanceApp,{health: 'down'}, 'health');
            return { messageId };
        }
    }

    setHealth(data) {
        let state = '';
        const stateArray = ['up', ' down'];
         switch (data?.scenarioType) {
             case 1:
                 state = 'up';
                 break;
             case 2:
                 state = 'down'
                 break;
             case 3:
                 state = stateArray[Math.floor(Math.random() * stateArray.length)]
                 break;
             default:
                 state = 'down';
         }
         return state;
    }
}