import {Injectable} from "@nestjs/common";
import {Queue} from "bullmq";
import {InjectQueue} from "@nestjs/bullmq";
import {OUTBOX_QUEUE} from "../../../common/constants/queue.constants";
import {EventTypesEnum} from "../../../common/enums/event-types.enum";
import {UserPayload} from "../../../common/types/user-payload.type";


@Injectable()
export class OutboxQueue {
    constructor(@InjectQueue(OUTBOX_QUEUE) private readonly queue: Queue) {}

    async addEvent(eventType: EventTypesEnum, payload: UserPayload, outboxId: string) {
        await this.queue.add(
            eventType,
            {
                payload,
            },
            {
                jobId: outboxId,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: { count: 50 },
                removeOnFail: { count: 10 },
            }
        );
    }

}