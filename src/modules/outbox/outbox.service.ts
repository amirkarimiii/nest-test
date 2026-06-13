import {Injectable} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {PrismaService} from "../../infrastructure/database/prisma.service";
import {EventTypesEnum} from "../../common/enums/event-types.enum";
import {MicroserviceService} from "../microservice/microservice.service";
import {UserPayloadSchema} from "../../common/types/user-payload.type";
import { OutboxStatus } from "generated/prisma/enums";


@Injectable()
export class OutboxService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly microservice: MicroserviceService,
    ) {
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async publishEvents() {

        console.log(`${new Date().toLocaleString()} - outbox service publishEvents...`);

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
                        const payload = result.data;
                        this.microservice.notifyUserCreation(event.eventType, payload);
                        await this.prisma.outboxEvent.update({
                            where: {
                                id: event.id,
                            },
                            data: {
                                status: OutboxStatus.PROCESSED,
                                processedAt: new Date(),
                            },
                        });
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