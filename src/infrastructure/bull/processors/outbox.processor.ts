import {Injectable, Logger} from "@nestjs/common";
import {Processor, WorkerHost} from "@nestjs/bullmq";
import {OUTBOX_QUEUE} from "../../../common/constants/queue.constants";
import { Job } from "bullmq";
import {MicroserviceService} from "../../../modules/microservice/microservice.service";
import {EventTypesEnum} from "../../../common/enums/event-types.enum";

@Processor(OUTBOX_QUEUE)
@Injectable()
export class OutboxProcessor extends WorkerHost {

    private readonly logger = new Logger(OutboxProcessor.name);
    constructor(private readonly microservice: MicroserviceService) {
        super();
    }

    async process(job: Job) {
        const { payload } = job.data;
        const eventType = job.name;
        this.logger.log(`Processing outbox event: ${eventType} [${job.id}]`);

        try {
            switch (eventType) {
                case EventTypesEnum.USER_CREATED:
                    this.microservice.notifyUserCreation(EventTypesEnum.USER_CREATED, payload);
                    break;
                default:
                    this.logger.warn(`Unknown event type: ${eventType}`);
            }
        } catch (error) {
            this.logger.error(`Failed to process job ${job.id}`, error);
            throw error;
        }

    }

}