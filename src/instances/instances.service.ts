import { Injectable } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import {PubSubService} from "../pubsub/pubsub.service";

@Injectable()
export class InstancesService {
    public idInstanceApp: string;

    constructor(
        private pubSubService: PubSubService
    ) {
    }
    setIdInstance(idInstanceApp) {
        console.log('---------set', idInstanceApp)
        this.idInstanceApp = idInstanceApp;
    }
    getIdInstance(): string {
        return this.idInstanceApp
    }

    async initializeInstance(idInstanceApp) {
        console.log(`Initialization...`);
        const topicName = 'health';
        const messageId = await this.pubSubService.publishMessage(topicName, idInstanceApp, {}, 'inscription');
        return { messageId }
    }

    async shutdownInstance(idInstanceApp: string) {
      console.log(`Shutdown...`);
      const topicName = 'health';
      const messageId = await this.pubSubService.publishMessage(topicName, idInstanceApp, {}, 'shutdown');
      return { messageId }
    }
}
