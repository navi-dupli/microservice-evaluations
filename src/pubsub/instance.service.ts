import { Injectable } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class InstanceService {
    public idInstanceApp: string;

    constructor() {
    }

    setIdInstance(idInstanceApp) {
        console.log('---------set', idInstanceApp)
        this.idInstanceApp = idInstanceApp;
    }
    getIdInstance(): string {
        return this.idInstanceApp
    }


}
