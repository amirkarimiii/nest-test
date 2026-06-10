import {Inject, Injectable} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";


@Injectable()
export class MicroserviceService {
    constructor(@Inject("MICROSERVICE_SERVICE") private readonly client: ClientProxy) {
    }

    async getUser() {
        return await firstValueFrom(this.client.send('get-user', {}));
    }

    async getUserById() {
        return await firstValueFrom(this.client.send('get-user-by-id', {}));
    }

    async getUserMessage() {
        return await firstValueFrom(this.client.emit('user-message', {}));
    }
}