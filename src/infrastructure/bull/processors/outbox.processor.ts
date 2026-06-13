import {Injectable, Logger} from "@nestjs/common";
import {Processor, WorkerHost} from "@nestjs/bullmq";
import {OUTBOX_QUEUE} from "../../../common/constants/queue.constants";
import {Job} from "bullmq";
import {MicroserviceService} from "../../../modules/microservice/microservice.service";
import {EventTypesEnum} from "../../../common/enums/event-types.enum";
import {PrismaService} from "../../database/prisma.service";
import {UserPayloadSchema} from "../../../common/types/user-payload.type";
import {OutboxStatus} from "../../../../generated/prisma/enums";

@Processor(OUTBOX_QUEUE)
@Injectable()
export class OutboxProcessor extends WorkerHost {

    private readonly logger = new Logger(OutboxProcessor.name);

    constructor(
        private readonly microservice: MicroserviceService,
        private readonly prisma: PrismaService,
    ) {
        super();
    }

    async process(job: Job) {
        const {payload} = job.data;
        const eventType = job.name;
        this.logger.log(`Processing outbox event: ${eventType} [${job.id}]`);
        try {
            switch (eventType) {
                case EventTypesEnum.USER_CREATED: {
                    const result = UserPayloadSchema.safeParse(payload);
                    if (result.success) {
                        const payload = result.data;
                            await this.prisma.outboxEvent.update({
                                where: {
                                    id: job.id,
                                },
                                data: {
                                    status: OutboxStatus.PROCESSED,
                                    processedAt: new Date(),
                                },
                            });
                            this.microservice.notifyUserCreation(eventType, payload);
                        }
                    // here it should be a else which notifies BullMQ that an error occurred
                    }
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