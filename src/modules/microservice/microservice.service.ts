import {Inject, Injectable} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {CreateUserDto} from "../../common/dto/create-user.dto";
import {EventTypesEnum} from "../../common/enums/event-types.enum";
import {UserPayload} from "../../common/types/user-payload.type";


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

    getUserMessage() {
        this.client.emit('user-message', {});
    }

    notifyUserCreation(event: EventTypesEnum, payload: UserPayload) {
        this.client.emit(event, {
            payload
        });
    }

}