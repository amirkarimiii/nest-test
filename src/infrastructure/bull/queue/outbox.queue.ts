import {Injectable, OnModuleInit} from "@nestjs/common";
import {Queue} from "bullmq";
import {InjectQueue} from "@nestjs/bullmq";
import {CronPattern, OUTBOX_QUEUE, PUBLISH_EVENTS_JOB, STUCK_EVENTS_RECOVERY_JOB} from "../constants/bullmq.constants";
import {EventTypesEnum} from "../../../common/enums/event-types.enum";
import {UserPayload} from "../../../common/types/user-payload.type";


@Injectable()
export class OutboxQueue implements OnModuleInit {
    constructor(@InjectQueue(OUTBOX_QUEUE) private readonly queue: Queue) {}

    async onModuleInit() {
        await this.queue.add(
            PUBLISH_EVENTS_JOB,
            {},
            {
                repeat: {
                    pattern: CronPattern.EVERY_20_SECONDS,
                },
                jobId: PUBLISH_EVENTS_JOB,
            }
        );

        await this.queue.add(
            STUCK_EVENTS_RECOVERY_JOB,
            {},
            {
                repeat: {
                    pattern: CronPattern.EVERY_5_MINUTES,
                },
                jobId: STUCK_EVENTS_RECOVERY_JOB,
            }
        );
    }

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