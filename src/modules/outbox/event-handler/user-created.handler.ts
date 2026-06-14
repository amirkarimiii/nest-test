import {EventHandlerInterface} from "./event-handler.interface";
import {EventTypesEnum} from "../../../common/enums/event-types.enum";
import {UserPayloadSchema} from "../../../common/types/user-payload.type";
import {Injectable} from "@nestjs/common";
import {OutboxQueue} from "../../../infrastructure/bull/queue/outbox.queue";


@Injectable()
export class UserCreatedHandler implements EventHandlerInterface {
    readonly eventType = EventTypesEnum.USER_CREATED;

    constructor(private readonly outboxQueue: OutboxQueue) {}

    async handle(payload: unknown, eventId: string) {
        const result = UserPayloadSchema.safeParse(payload);
        if (!result.success) {
            throw new Error(`Validation failed for event ${eventId}: ${result.error}`);
        }
        await this.outboxQueue.addEvent(this.eventType, result.data, eventId);

    }

}