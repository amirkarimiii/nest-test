import {Injectable, Logger} from "@nestjs/common";
import {PrismaService} from "../../infrastructure/database/prisma.service";
import {EventTypesEnum} from "../../common/enums/event-types.enum";
import {UserPayload, UserPayloadSchema} from "../../common/types/user-payload.type";
import { OutboxStatus } from "generated/prisma/enums";
import {OutboxQueue} from "../../infrastructure/bull/queue/outbox.queue";
import {Cron, CronExpression} from "@nestjs/schedule";


@Injectable()
export class OutboxService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly outboxQueue: OutboxQueue,
    ) {}

    private readonly logger = new Logger(OutboxService.name);

    @Cron('*/20 * * * * *')
    async publishEvents() {

        const events = await this.prisma.outboxEvent.findMany({
            where: {
                status: OutboxStatus.PENDING
            },
            take: 20,
        });

        for (const event of events) {
            switch (event.eventType) {
                case EventTypesEnum.USER_CREATED: {
                    const result = UserPayloadSchema.safeParse(event.payload);
                    if (result.success) {
                        await this.outboxQueue.addEvent(event.eventType, result.data, event.id)
                    } else {
                        throw new Error(`error: ${result.error}`);
                    }
                }
            }
        }

    }

    async getPendingEvents() {
        return this.prisma.outboxEvent.findMany({
            where: {
                status: OutboxStatus.PENDING
            },
            take: 100,
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

    async getPendingEventsCount() {
        return this.prisma.outboxEvent.count({
            where: {
                status: OutboxStatus.PENDING
            }
        });
    }

    async getProcessedEvents() {
        return this.prisma.outboxEvent.findMany({
            where: {
                status: OutboxStatus.PROCESSED
            },
            take: 100,
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

}