import {Injectable, Logger} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {PrismaService} from "../../infrastructure/database/prisma.service";
import {EventTypesEnum} from "../../common/enums/event-types.enum";
import {MicroserviceService} from "../microservice/microservice.service";
import {UserPayload, UserPayloadSchema} from "../../common/types/user-payload.type";
import { OutboxStatus } from "generated/prisma/enums";
import {OutboxQueue} from "../../infrastructure/bull/queue/outbox.queue";


@Injectable()
export class OutboxService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly outboxQueue: OutboxQueue,
    ) {
    }

    private readonly logger = new Logger(OutboxService.name);

    async publishEvents(eventType: EventTypesEnum, payload: UserPayload) {

        const outboxEvent = await this.prisma.outboxEvent.create({
            data: {
                eventType,
                payload,
            },
        });
        await this.outboxQueue.addEvent(eventType, payload, outboxEvent.id);
        this.logger.log(`Outbox event created and queued: ${outboxEvent.id}`);

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