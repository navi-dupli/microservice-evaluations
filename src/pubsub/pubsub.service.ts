// pubsub.service.ts
import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class PubSubService {
    private pubSubClient: PubSub;

    constructor() {
        this.pubSubClient = new PubSub();
    }

    async publishMessage(topicName: string, data: any) {
        const topic = this.pubSubClient.topic(topicName);
        const dataBuffer = Buffer.from(JSON.stringify(data));

        const message = {
            "specversion" : "1.0",
            "type" : "com.github.navi-dupli.health",
            "source" : "https://github.com/navi-dupli/microservice-evaluations",
            "subject" : "microservice-evaluations",
            "id" : uuidv4(),
            "time" : new Date().getTime(),
            "data" : dataBuffer
        }
        const messageId = await topic.publishMessage(message);

        return messageId;
    }

    async subscribeToTopic(topicName: string, subscriptionName: string, callback: (message: any) => void) {
        const topic = this.pubSubClient.topic(topicName);
        const subscription = topic.subscription(subscriptionName);

        subscription.on('message', (message) => {
            callback(JSON.parse(message.data.toString()));
            message.ack();
        });
    }
}
