import {Injectable, Logger} from "@nestjs/common";
import {OnWorkerEvent, Processor, WorkerHost} from "@nestjs/bullmq";
import {OUTBOX_QUEUE} from "../../../common/constants/queue.constants";
import {Job} from "bullmq";
import {MicroserviceService} from "../../../modules/microservice/microservice.service";
import {PrismaService} from "../../database/prisma.service";
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
        const time = new Date().toLocaleString();
        try {
            await this.microservice.notifyUserCreation(eventType, payload);
            await this.prisma.outboxEvent.update({
                where: {
                    id: job.id,
                    status: OutboxStatus.ENQUEUED,
                },
                data: {
                    status: OutboxStatus.PROCESSED,
                    updatedAt: time,
                    processedAt: time
                }
            });
        } catch (error) {
            this.logger.error(`Failed to process job ${job.id}`, error);
            throw error;
        }

    }

    @OnWorkerEvent('completed')
    async onComplete(job: Job) {

    }

    @OnWorkerEvent('failed')
    async onFailure(job: Job) {

        const maxAttempts = job.opts.attempts ?? 10;

        if (job.attemptsMade >= maxAttempts) {
            await this.prisma.outboxEvent.update({
                where: {
                    id: job.id as string
                },
                data: {
                    status: OutboxStatus.FAILED,
                    attempts: job.attemptsMade,
                    lastAttempt: new Date()
                }
            });

        } else {
            await this.prisma.outboxEvent.update({
                where: {
                    id: job.id as string
                },
                data: {
                    attempts: job.attemptsMade,
                    lastAttempt: new Date()
                }
            });
        }

    }

}