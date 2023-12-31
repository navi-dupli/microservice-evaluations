// pubsub.service.ts
import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import {v4 as uuidv4} from 'uuid';
import {FirebaseAdmin, InjectFirebaseAdmin} from "nestjs-firebase";

@Injectable()
export class PubSubService {
    private pubSubClient: PubSub;
    private idInstanceApp: string;

    constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {
        this.pubSubClient = new PubSub();
    }

    async publishMessage(topicName: string, instance: string, data: any, type: string) {
        const topic = this.pubSubClient.topic(topicName);
        const message = {
            "specversion" : "1.0",
            "type" : type,
            "source" : "micro-evaluaciones",
            "instance" : instance,
            "id" : uuidv4(),
            "time" : new Date(),
            ...data
        }

        if (type === 'health') {
            const healthRef = this.firebase.firestore.collection('health');
            await healthRef.add(message);
        }

        const dataBuffer = Buffer.from(JSON.stringify(message));
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
