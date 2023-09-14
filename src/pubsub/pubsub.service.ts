// pubsub.service.ts
import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService {
    private pubSubClient: PubSub;

    constructor() {
        this.pubSubClient = new PubSub();
    }

    async publishMessage(topicName: string, data: any) {
        const topic = this.pubSubClient.topic(topicName);
        const dataBuffer = Buffer.from(JSON.stringify(data));

        const messageId = await topic.publishMessage({data: dataBuffer});

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
