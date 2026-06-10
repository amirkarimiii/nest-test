import {Inject, Injectable} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";


@Injectable()
export class MicroserviceService {
    constructor(@Inject("MICROSERVICE_SERVICE") private readonly client: ClientProxy) {
    }

    getHello() {
        return this.client.send(
            'get-user',
            {},
        )
    }
}